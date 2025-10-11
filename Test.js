const { json } = require("stream/consumers");

// Item data from document (simulated for testing)
const itemData = [
    // Item 01 - Maintain Dimension: true, dimensionIn: 1, makeManagementTypeNo: 1 (none)
    {
        id: 46, itemName: "Item 01", unitId: 4686, standardWt: 125.25,
        isMaintainDimension: true, dimensionIn: 1, dimensionUnitId: 4687, makeManagementTypeNo: 1,
        itemMasterMakeDetail: []
    },
    // Item 02 - Maintain Dimension: false, makeManagementTypeNo: 2 (all make)
    {
        id: 47, itemName: "Item 02", unitId: 4687, standardWt: 150.0,
        isMaintainDimension: false, makeManagementTypeNo: 2,
        itemMasterMakeDetail: []
    },
    // Item 03 - Maintain Dimension: true, dimensionIn: 2, makeManagementTypeNo: 3 (selected)
    {
        id: 48, itemName: "Item 03", unitId: 4688, standardWt: 789.78,
        isMaintainDimension: true, dimensionIn: 2, dimensionUnitId: 4689, makeManagementTypeNo: 3,
        itemMasterMakeDetail: [
            { makeId: 2473, catNo: "catNo 01" },
            { makeId: 2474, catNo: "catNo 02" },
            { makeId: 2475, catNo: "catNo 03" }
        ]
    },
    // Item 04 - Maintain Dimension: false, makeManagementTypeNo: 1 (none)
    {
        id: 49, itemName: "Item 04", unitId: 4689, standardWt: 200.0,
        isMaintainDimension: false, makeManagementTypeNo: 1,
        itemMasterMakeDetail: []
    },
    // Item 05 - Maintain Dimension: true, dimensionIn: 1, makeManagementTypeNo: 2 (all make)
    {
        id: 50, itemName: "Item 05", unitId: 4690, standardWt: 1456.44,
        isMaintainDimension: true, dimensionIn: 1, dimensionUnitId: 4691, makeManagementTypeNo: 2,
        itemMasterMakeDetail: []
    },
    // Item 06 - Maintain Dimension: false, makeManagementTypeNo: 3 (selected)
    {
        id: 51, itemName: "Item 06", unitId: 4691, standardWt: 300.0,
        isMaintainDimension: false, makeManagementTypeNo: 3,
        itemMasterMakeDetail: [
            { makeId: 2477, catNo: "catNo 01" },
            { makeId: 2478, catNo: "catNo 02" },
            { makeId: 2479, catNo: "catNo 03" }
        ]
    },
    // Item 07 - Maintain Dimension: true, dimensionIn: 1, makeManagementTypeNo: 1 (none)
    {
        id: 52, itemName: "Item 07", unitId: 4692, standardWt: 2123.1,
        isMaintainDimension: true, dimensionIn: 1, dimensionUnitId: 4693, makeManagementTypeNo: 1,
        itemMasterMakeDetail: []
    },
    // Item 08 - Maintain Dimension: false, makeManagementTypeNo: 2 (all make)
    {
        id: 53, itemName: "Item 08", unitId: 4693, standardWt: 400.0,
        isMaintainDimension: false, makeManagementTypeNo: 2,
        itemMasterMakeDetail: []
    },
    // Item 09 - Maintain Dimension: true, dimensionIn: 1, makeManagementTypeNo: 3 (selected)
    {
        id: 54, itemName: "Item 09", unitId: 4694, standardWt: 2789.76,
        isMaintainDimension: true, dimensionIn: 1, dimensionUnitId: 4695, makeManagementTypeNo: 3,
        itemMasterMakeDetail: [
            { makeId: 2480, catNo: "catNo 01" },
            { makeId: 2481, catNo: "catNo 02" },
            { makeId: 2482, catNo: "catNo 03" }
        ]
    },
    // Item 10 - Maintain Dimension: false, makeManagementTypeNo: 1 (none), Status: 2 (Inactive)
    {
        id: 55, itemName: "Item 10", unitId: 4694, standardWt: 500.0,
        isMaintainDimension: false, makeManagementTypeNo: 1, statusNo: 2,
        itemMasterMakeDetail: []
    }
];

// Mock data for other entities
const BUData = [{ id: 1 }, { id: 2 }];
const BPWithBU = [
    { businessPartnerLocationDetail: [{ id: 64 }], businessPartnerContactPersonDetail: [{ id: 101 }] },
    { businessPartnerLocationDetail: [{ id: 65 }], businessPartnerContactPersonDetail: [{ id: 102 }] },
    { businessPartnerLocationDetail: [{ id: 66 }], businessPartnerContactPersonDetail: [{ id: 103 }] },
    { businessPartnerLocationDetail: [{ id: 67 }], businessPartnerContactPersonDetail: [{ id: 104 }] },
    { businessPartnerLocationDetail: [{ id: 68 }], businessPartnerContactPersonDetail: [{ id: 105 }] },
    { businessPartnerLocationDetail: [{ id: 69 }], businessPartnerContactPersonDetail: [{ id: 106 }] },
    { businessPartnerLocationDetail: [{ id: 70 }], businessPartnerContactPersonDetail: [{ id: 107 }] },
    { businessPartnerLocationDetail: [{ id: 71 }], businessPartnerContactPersonDetail: [{ id: 108 }] },
    { businessPartnerLocationDetail: [{ id: 72 }], businessPartnerContactPersonDetail: [{ id: 109 }] }
];
const departmentData = [{ id: 18 }, { id: 19 }, { id: 20 }];
const costCenterData = [{ id: 1001 }, { id: 1002 }, { id: 1003 }];
const makeData = [
    { id: 2473 }, { id: 2474 }, { id: 2475 }, { id: 2477 }, { id: 2478 }, 
    { id: 2479 }, { id: 2480 }, { id: 2481 }, { id: 2482 }
];

// Helper functions
function getFutureDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

function calculateQty(standardWt, multiplier = 0.002) {
    return Math.round(standardWt * multiplier * 100) / 100;
}

function createPOItemSizeDetail(item, qty, shouldHaveSize = null) {
    // Auto-determine if size should be included based on item properties
    if (shouldHaveSize === null) {
        shouldHaveSize = item.isMaintainDimension;
    }
    
    if (shouldHaveSize) {
        return [{
            "length": item.dimensionIn === 1 ? 2.5 : 0,
            "width": item.dimensionIn === 2 ? 1.8 : (item.dimensionIn === 1 ? 1.2 : 0),
            "pcs": Math.ceil(qty * 0.1) || 1,
            "qtyPerPcs": Math.round((qty / (Math.ceil(qty * 0.1) || 1)) * 100) / 100,
            "totalQty": qty,
            "unitWeight": item.standardWt
        }];
    }
    return []; // No size detail for non-dimension items
}

function createMakeId(item) {
    switch (item.makeManagementTypeNo) {
        case 1: // None - should be null
            return null;
        case 2: // All make - any make ID is allowed
            return makeData[0]?.id || null;
        case 3: // Selected - must be from item's make list
            return item.itemMasterMakeDetail.length > 0 ? item.itemMasterMakeDetail[0].makeId : null;
        default:
            return null;
    }
}

// Test Cases Array
const testCases = [
    // SUCCESS CASES
    {
        name: "SUCCESS: Dimension Item with Proper Size Detail",
        description: "Item with dimension maintenance and proper size details",
        expectedResult: "PASS",
        item: itemData[0], // Item 01 - isMaintainDimension: true, makeManagementTypeNo: 1
        qty: calculateQty(itemData[0].standardWt),
        rate: 1.5,
        makeId: null,
        includeSizeDetail: true,
        forceIncludeSize: null
    },
    
    {
        name: "SUCCESS: Non-Dimension Item without Size Detail",
        description: "Item without dimension maintenance and no size details",
        expectedResult: "PASS",
        item: itemData[1], // Item 02 - isMaintainDimension: false, makeManagementTypeNo: 2
        qty: calculateQty(itemData[1].standardWt || 150),
        rate: 2.0,
        makeId: makeData[0]?.id,
        includeSizeDetail: false,
        forceIncludeSize: null
    },
    
    {
        name: "SUCCESS: Selected Make with Valid Make ID",
        description: "Item with selected make management and valid make from item's list",
        expectedResult: "PASS",
        item: itemData[2], // Item 03 - makeManagementTypeNo: 3, has makes
        qty: calculateQty(itemData[2].standardWt),
        rate: 1.8,
        makeId: itemData[2].itemMasterMakeDetail[0].makeId,
        includeSizeDetail: true,
        forceIncludeSize: null
    },
    
    {
        name: "SUCCESS: All Make Management Type",
        description: "Item with all make management allows any make ID",
        expectedResult: "PASS",
        item: itemData[4], // Item 05 - makeManagementTypeNo: 2
        qty: calculateQty(itemData[4].standardWt),
        rate: 1.2,
        makeId: makeData[3]?.id,
        includeSizeDetail: true,
        forceIncludeSize: null
    },
    
    // FAILURE CASES
    {
        name: "FAIL: Dimension Item without Required Size Detail",
        description: "Item requires dimension but size detail is missing",
        expectedResult: "FAIL",
        item: itemData[0], // Item 01 - isMaintainDimension: true
        qty: calculateQty(itemData[0].standardWt),
        rate: 1.5,
        makeId: null,
        includeSizeDetail: false,
        forceIncludeSize: false
    },
    
    {
        name: "FAIL: Non-Dimension Item with Unnecessary Size Detail",
        description: "Item doesn't maintain dimension but size detail provided",
        expectedResult: "FAIL",
        item: itemData[1], // Item 02 - isMaintainDimension: false
        qty: calculateQty(itemData[1].standardWt || 150),
        rate: 2.0,
        makeId: makeData[0]?.id,
        includeSizeDetail: true,
        forceIncludeSize: true
    },
    
    {
        name: "FAIL: None Make Management with Make ID",
        description: "Item has none make management but make ID is provided",
        expectedResult: "FAIL",
        item: itemData[0], // Item 01 - makeManagementTypeNo: 1 (none)
        qty: calculateQty(itemData[0].standardWt),
        rate: 1.5,
        makeId: makeData[0]?.id, // Should be null for none type
        includeSizeDetail: true,
        forceIncludeSize: null
    },
    
    {
        name: "FAIL: Selected Make with Invalid Make ID",
        description: "Item with selected make but using make not in item's list",
        expectedResult: "FAIL",
        item: itemData[2], // Item 03 - makeManagementTypeNo: 3
        qty: calculateQty(itemData[2].standardWt),
        rate: 1.8,
        makeId: 9999, // Invalid make ID not in item's list
        includeSizeDetail: true,
        forceIncludeSize: null
    },
    
    {
        name: "FAIL: Inactive Item",
        description: "Using inactive item in PO",
        expectedResult: "FAIL",
        item: itemData[9], // Item 10 - statusNo: 2 (inactive)
        qty: calculateQty(itemData[9].standardWt || 500),
        rate: 1.0,
        makeId: null,
        includeSizeDetail: false,
        forceIncludeSize: null
    },
    
    {
        name: "FAIL: Zero Quantity",
        description: "Item with zero quantity",
        expectedResult: "FAIL",
        item: itemData[3], // Item 04
        qty: 0,
        rate: 1.5,
        makeId: null,
        includeSizeDetail: false,
        forceIncludeSize: null
    },
    
    {
        name: "FAIL: Negative Rate",
        description: "Item with negative rate",
        expectedResult: "FAIL",
        item: itemData[3], // Item 04
        qty: calculateQty(itemData[3].standardWt || 200),
        rate: -1.5,
        makeId: null,
        includeSizeDetail: false,
        forceIncludeSize: null
    },
    
    // EDGE CASES
    {
        name: "EDGE: Dimension Item with Zero Size Values",
        description: "Item with dimension but zero length/width values",
        expectedResult: "EDGE",
        item: itemData[6], // Item 07 - isMaintainDimension: true
        qty: calculateQty(itemData[6].standardWt),
        rate: 1.0,
        makeId: null,
        includeSizeDetail: true,
        forceIncludeSize: null,
        customSizeDetail: [{
            "length": 0,
            "width": 0,
            "pcs": 1,
            "qtyPerPcs": calculateQty(itemData[6].standardWt),
            "totalQty": calculateQty(itemData[6].standardWt),
            "unitWeight": itemData[6].standardWt
        }]
    },
    
    {
        name: "EDGE: Very Large Quantity",
        description: "Item with extremely large quantity",
        expectedResult: "EDGE",
        item: itemData[7], // Item 08
        qty: 999999.99,
        rate: 0.001,
        makeId: makeData[0]?.id,
        includeSizeDetail: false,
        forceIncludeSize: null
    }
];

// Generate PO data for each test case
const generatedPOs = testCases.map((testCase, index) => {
    const qty = testCase.qty;
    const basicAmount = Math.round(qty * testCase.rate * 100) / 100;
    
    // Determine size detail
    let sizeDetail = [];
    if (testCase.customSizeDetail) {
        sizeDetail = testCase.customSizeDetail;
    } else {
        sizeDetail = createPOItemSizeDetail(testCase.item, qty, testCase.forceIncludeSize);
    }
    
    return {
        testCase: {
            name: testCase.name,
            description: testCase.description,
            expectedResult: testCase.expectedResult
        },
        poData: {
            "buId": BUData[0].id,
            "docNoYearly": `PO${500 + index}`,
            "docDate": getFutureDate(0),
            "amendmentDate": getFutureDate(0),
            "docStatusNo": 10,
            "docSeriesId": null,
            "expenditureTypeNo": 1,
            "refDocTypeNo": 3,
            "supplierLocationId": BPWithBU[index % BPWithBU.length]?.businessPartnerLocationDetail[0]?.id || 64,
            "contactPersonId": BPWithBU[index % BPWithBU.length]?.businessPartnerContactPersonDetail[0]?.id || null,
            "validityDate": getFutureDate(30),
            "departmentId": departmentData[index % departmentData.length]?.id || 18,
            "freightTypeNo": 1,
            "freightRateTypeNo": 1,
            "freightAmount": 1000,
            "noOfTrips": null,
            "fromLocation": "Test Location A",
            "toLocation": "Test Location B",
            "currencyNo": 1,
            "exchangeRate": 1,
            "netAmount": basicAmount + 1000,
            "basicAmount": basicAmount,
            "termsNConditionGroupId": 5,
            "remarks": `Test Case: ${testCase.name}`,
            "paymentTerms": "Net 30 days",
            "poConsigneeDetail": [
                {
                    "consigneeLocationId": 60
                }
            ],
            "poItemDetail": [
                {
                    "itemId": testCase.item.id,
                    "makeId": testCase.makeId,
                    "techSpecification": `Technical specification for ${testCase.item.itemName}`,
                    "unitId": testCase.item.unitId,
                    "qty": qty,
                    "rate": testCase.rate,
                    "basicAmount": basicAmount,
                    "netAmount": basicAmount,
                    "toleranceTypeNo": 1,
                    "tolerancePlus": 5,
                    "toleranceMinus": 5,
                    "costCenterId": costCenterData[0]?.id,
                    "remarks": `Test item: ${testCase.description}`,
                    "poItemScheduleDetail": [
                        {
                            "scheduleDate": getFutureDate(7),
                            "scheduleQty": qty
                        }
                    ],
                    "poItemSizeDetail": sizeDetail,
                    "poprDetail": [
                        {
                            "prItemDetailId": 128 + index,
                            "firstCf": 11,
                            "secondCf": 12,
                            "poQty": qty,
                            "poRate": testCase.rate,
                            "poUnitId": testCase.item.unitId,
                            "prUnitId": testCase.item.unitId,
                            "prMakeId": null,
                            "poMakeId": testCase.makeId
                        }
                    ]
                }
            ],
            "poTermsNConditionDetail": [
                {
                    "termsNConditionHeadId": 3,
                    "termsNCondition": "Standard terms and conditions"
                }
            ]
        }
    };
});


// Summary by expected result
const summary = {
    PASS: generatedPOs.filter(po => po.testCase.expectedResult === "PASS").length,
    FAIL: generatedPOs.filter(po => po.testCase.expectedResult === "FAIL").length,
    EDGE: generatedPOs.filter(po => po.testCase.expectedResult === "EDGE").length
};


// Log each test case
generatedPOs.forEach((po, index) => {
    const resultIcon = po.testCase.expectedResult === "PASS" ? "✅" : 
                      po.testCase.expectedResult === "FAIL" ? "❌" : "⚠️";
    
    console.log(`${resultIcon} Test Case ${index + 1}: ${po.testCase.name}`);
    console.log(`   Description: ${po.testCase.description}`);
    console.log(`   Expected: ${po.testCase.expectedResult}`);
    console.log(`   PO Number: ${po.poData.docNoYearly}`);
    console.log(`   Item: ${po.poData.poItemDetail[0].itemId} (${itemData.find(i => i.id === po.poData.poItemDetail[0].itemId)?.itemName})`);
    console.log(`   Make ID: ${po.poData.poItemDetail[0].makeId}`);
    console.log(`   Has Size Detail: ${po.poData.poItemDetail[0].poItemSizeDetail.length > 0}`);
    console.log(`   JSON: ${JSON.stringify(po.poData, null, 2)}\n`);
});

// Set environment variables
// generatedPOs.forEach((po, index) => {
//     console.log(po.poData)
// });

console.log(JSON.stringify(generatedPOs[0].poData))


