const EWS = require('node-ews');
const { uniq } = require('ramda');
const { download, isValidWetransfertUrl } = require('wetransfert');

const { gql, gqlClient, DISTINCT_VALUES } = require('../api');
const { ewsArgs, parseData } = require('./data-utils');

const CREATE_PERU_DEPARTURE_INSPECTION = gql`
  mutation CREATE_PERU_DEPARTURE_INSPECTION(
    $input: CreatePeruDepartureInspectionInput!
  ) {
    createPeruDepartureInspection(input: $input) {
      clientMutationId
    }
  }
`;

const ewsConfig = {
  username: process.env.PDI_USERNAME,
  password: process.env.PDI_PASSWORD,
  host: process.env.PDI_EWS_SERVER,
};

const ews = new EWS(ewsConfig);

const onError = (err) => {
  console.log(err.stack);
};

const urlRegex =
  /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;

const fetchPeruDepartureInspections = () => {
  console.log(
    `\nFetching peru departure inspections: ${new Date().toString()}`,
  );
  gqlClient
    .request(DISTINCT_VALUES, {
      columnName: 'container_id',
      tableName: 'peru_departure_inspection',
      schemaName: 'inspection',
    })
    .then(({ distinctValues: { nodes } }) => {
      ews
        .run('FindItem', ewsArgs.FindItem)
        .then((result) => {
          const Items =
            result.ResponseMessages.FindItemResponseMessage.RootFolder.Items;
          if (Items) {
            Items.Message.map((message) => {
              const {
                ItemId: {
                  attributes: { Id, ChangeKey },
                },
              } = message;

              const archiveMessage = (successMessage = 'Message archived') => {
                ews
                  .run('UpdateItem', ewsArgs.UpdateItem(Id, ChangeKey))
                  .then(() => {
                    ews
                      .run(
                        'MoveItem',
                        ewsArgs.MoveItem(
                          process.env.PDI_FOLDER_ID,
                          Id,
                          ChangeKey,
                        ),
                      )
                      .then(() => {
                        console.log(successMessage);
                      })
                      .catch(onError);
                  })
                  .catch(onError);
              };
              ews
                .run('GetItem', ewsArgs.GetItem(Id, ChangeKey))
                .then((res) => {
                  const Message =
                    res.ResponseMessages.GetItemResponseMessage.Items.Message;
                  const Attachments = Message.Attachments;
                  if (Attachments) {
                    const files = Attachments.FileAttachment;
                    const handleFile = (file) => {
                      ews
                        .run(
                          'GetAttachment',
                          ewsArgs.GetAttachment(
                            file.AttachmentId.attributes.Id,
                          ),
                        )
                        .then((r) => {
                          const FileAttachment =
                            r.ResponseMessages.GetAttachmentResponseMessage
                              .Attachments.FileAttachment;
                          const data = parseData(FileAttachment);
                          if (!nodes.includes(data.containerId)) {
                            console.log(
                              `Data file parsed: ${FileAttachment.Name}`,
                            );
                            gqlClient
                              .request(CREATE_PERU_DEPARTURE_INSPECTION, {
                                input: { peruDepartureInspection: data },
                              })
                              .then(() => {
                                const Body = Message.Body['$value'];
                                const urls = uniq(
                                  [...Body.matchAll(urlRegex)].map(
                                    (url) => url[0],
                                  ),
                                );
                                urls.forEach((url) => {
                                  if (isValidWetransfertUrl(url)) {
                                    const outputDir = `/peru-departure-inspections/${data.containerId}/images`;
                                    download(url, outputDir)
                                      .then((res) => {
                                        console.log(
                                          `Files downloaded from ${res.content.shortened_url} to ${outputDir}`,
                                        );
                                      })
                                      .catch(onError);
                                  }
                                });
                              })
                              .catch(onError);
                            archiveMessage(
                              `Message: \"${Message.Subject}\" with data for container ${data.containerId} file was archived.`,
                            );
                          } else {
                            console.log(
                              `Duplicate data file found: ${FileAttachment.Name}`,
                            );
                            archiveMessage(
                              `Message: \"${Message.Subject}\" with duplicate data file was archived.`,
                            );
                          }
                        })
                        .catch(onError);
                    };
                    if (files.length) {
                      files.map(handleFile);
                    } else {
                      handleFile(files);
                    }
                  } else {
                    archiveMessage(
                      `Message: \"${Message.Subject}\" with no attachments was archived.`,
                    );
                  }
                })
                .catch(onError);
            });
          } else {
            console.log('No new inspections found.');
          }
        })
        .catch(onError);
    })
    .catch(onError);
};

const findFolders = () => {
  ews
    .run('FindFolder', ewsArgs.FindFolder)
    .then((folders) => {
      console.log(
        folders.ResponseMessages.FindFolderResponseMessage.RootFolder.Folders
          .Folder.FolderId.attributes,
      );
    })
    .catch(onError);
};

module.exports = {
  fetchPeruDepartureInspections,
};
