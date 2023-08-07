Programs is a list of projected sales by products and customers. New system is connected to postgresql data. Replaces spreadsheets.

"Program" seems to be an as400 term. Its used in the java code. Scratch that. Deeper investigation shows there is a "program" call API for the AS400. In the case of the legacy java application location drop down it is calling: "Fruits", "SelectLOC"
https://www.ibm.com/docs/api/v1/content/ssw_ibm_i_72/rzahh/javadoc/com/ibm/as400/data/ProgramCallDocument.htm?view=embed

Customers and Shipping is split by coast. East vs West.
Shippers grand total is inbound product.
Customer grand total is outbound products.



Where does the import code live? It is an RPG program in the AS400. Joe offerred to take me through these.

Is this a pain point? How much time is spent on cleaning and importing data? How accruate is it?

Shipper import.
* Many different formats. They would like a standard format.
* Back and forth trying to fix the data to conform to some "standard" that varies
* Once fixed, that data is copied into a scratch paid and imported into the as400 as pre-inventory. 
* 

Projection import (old)
* Fill out spreadsheet
* Email
* Delivered to Nancy. Nancy has a lot of internal knowledge for validation.
Projection import (new)
* Web page with some autocomplete and validations
* Still delivered to Nancy for review and import

Doesn't seem like the new system has authentication

Price Sheets 
* Stored only postgresql
* Used for negotiating sales prices
* Need for tracking price history

Some customer data in hubspot

Looks like a different schema between orders and pre-fil; orders:

    const realOrderItems = await db
      .query('select * from JVFIL.ORDP120B;')
      .catch(onError);
    const preOrderItems = await db
      .query('select * from JVPREFIL.ORDP120B;')
      .catch(onError);
    const orderItems = [
      ...realOrderItems.map((v) => ({ ...v, isPre: false })),
      ...preOrderItems.map((v) => ({ ...v, isPre: true })),
    ];
    return orderItems;

There is a mapping of as400 columns to postgresql/graphql columns. That is probably the most valuable output from the previous work. This could become a db2 link with views to remove the import entirely.

Meeting with Nancy

Projection is pre-inventory.
Manifest is the packing list received from shipper.
Nancy knows most of the product codes. Looks up a few.
Builds out the pre-inventory. Someone else "signs off" on it being complete
Then copies the orders into "real" inventory

Some orders might be split between pre-inventory and inventory for an order.
Notes are included on the pre-inventory

Sales staff send orders to Nancy
Nancy enters a load number. Sequential number shared with Courtney.
Nancy sends orders to Courtney for "Delivered" orders. There is a spreadsheet for "Delivered" orders. Halsey built a prototype. What data is kept in the spreadsheet versus the as400?

Transmission file (excel) from 3PL. Imported into the as400. Something with Nick. Stores where pallets are for product. Also pulls in QC and location data.

Thought, do they need a b2b interface?

Pallet master file contains received and current.

Operations will print out the next days truck sheet and picking ticket(s) for orders. Operations tells QC about the orders. QC will determine where to select the procuct from for operations. Expediter (operations) will select fruit, load a truck/pallets and write the pallet ids on the print out. Then shipping office (operations) enters the values into as400. Can print a bill of lading.

3PL has scanning infrastructure that may be beneficial to integrate with.

There can be a spare partial pallet from order delivery? It may/may not be removed from inventory? its up to sale personal to sell these? I don't understand how this works.

Invoice is generated from the load.

30 years ago had an order form sales. No one used it. Too many options. Not stream lined enough.

Pallets have "license plates" to scan and identify the product. Daughter tags to tear off and place on pick list.

Repacks
* Reorganizing/splitting pallets into orders
* Someone is managing repacks outside of the as400. Notes on the order in the as400.