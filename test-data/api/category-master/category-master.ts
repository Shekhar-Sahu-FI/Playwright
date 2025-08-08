export const saveWithInMaxLength = [
  {
    description: "Save With 1 character. @ItemCategoryMaster",
    save: {
      code: "a",
      itemCategoryName: "a",
      statusNo: 2,
      statusRemarks: "a",
    },
    expectedResult: true,
  },
  {
    description: "Save With max-1 character. @ItemCategoryMaster",
    save: {
      code: "b",
      itemCategoryName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
  {
    description: "Save With max character length. @ItemCategoryMaster",
    save: {
      code: "cc",
      itemCategoryName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
  {
    description: "Save With max character length Status Remarks. @ItemCategoryMaster",
    save: {
      code: "dd",
      itemCategoryName: "aaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
  {
    description: "Save With max character length code. @ItemCategoryMaster",
    save: {
      code: "ee",
      itemCategoryName: "aaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaa",
    },
    expectedResult: true,
  },
  {
    description: "Save With max character length Item Categoty Name. @ItemCategoryMaster",
    save: {
      code: "ff",
      itemCategoryName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaa",
    },
    expectedResult: true,
  },
];

export const exceedCharacterLength = [
  {
    description: "Max +1 Character for code 2 + 1 character @ItemCategoryMaster",
    save: {
      code: "aaa",
      itemCategoryName: "qqqq",
      statusNo: 1,
      statusRemarks: "qqqq",
    },
    validationError: [
      {
        PropertyName: "Code",
        ErrorMessage: "Code must be between 1 and 2 characters."
      },
    ],
  },
  {
    description: "Max +1 Character for itemCategoryName 100 + 1 character @ItemCategoryMaster",
    save: {
      code: "qq",
      itemCategoryName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 1,
      statusRemarks: "",
    },
    validationError: [
      {
        PropertyName: "ItemCategoryName",
        ErrorMessage: "Item Category Name must be between 1 and 100 characters."
      },
    ],
  },
  {
    description: "Max +1 Character for statusRemarks 300 + 1 character @ItemCategoryMaster",
    save: {
      itemCategoryName: "qq",
      code: "qqqq",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    validationError: [
      {
        PropertyName: "StatusRemarks",
        ErrorMessage: "Status Remarks must be between 1 and 300 characters."
      },
    ],
  },
  {
    description: "Max +1 Character for statusRemarks 300 + 1 character @ItemCategoryMaster",
    save: {
      itemCategoryName: "qq",
      code: "qq",
      statusNo: 1,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    validationError: [
      {
        PropertyName: "StatusRemarks",
        ErrorMessage: "Status Remarks must be between 1 and 300 characters."
      },
    ],
  },
];

export const blankMandatoryField = [
  {
    description: "Blank itemCategoryName @ItemCategoryMaster",
    save: {
      itemCategoryName: "",
      code: "qq",
      statusNo: 1,
      statusRemarks: "qqqq",
    },
    validationError: [
      {
        PropertyName: "ItemCategoryName",
        ErrorMessage: "Item Category Name is required.",
      },
    ],
  },
  {
    description: "Blank code @ItemCategoryMaster",
    save: {
      itemCategoryName: "wwww",
      code: "",
      statusNo: 1,
      statusRemarks: "wwww",
    },
    validationError: [
      {
        PropertyName: "Code",
        ErrorMessage: "Code is required.",
      },
    ],
  },
  {
    description: "Blank statusRemarks @ItemCategoryMaster",
    save: {
      itemCategoryName: "rrrr",
      code: "rr",
      statusNo: 2,
      statusRemarks: "",
    },
    validationError: [
      {
        PropertyName: "StatusRemarks",
        ErrorMessage: "Status Remarks is required.",
      },
    ],
  },
];

export const getAPIValidationMessage = [
  {
    description: "Empty Json @ItemCategoryMasterGetApi",
    save: {},
    validationError: [
      {
        PropertyName: "",
        ErrorMessage: "Provide at least one filter criteria.",
      },
    ],
  },
  {
    description: "Single character in code. @ItemCategoryMasterGetApi",
    save: {
      code: "a",
    },
    validationError: [
      {
        PropertyName: "Code",
        ErrorMessage: "Provide at least 2 characters for code.",
      },
    ],
  },
   {
    description: "Single Character in itemCategoryName @ItemCategoryMaster",
    save: {
      itemCategoryName: "a",
    },
    validationError: [
      {
        PropertyName: "ItemCategoryName",
        ErrorMessage: "Provide at least 2 characters for item category name.",
      },
    ],
  },
  {
    description: "Empty itemCategoryName @ItemCategoryMasterGetApi",
    save: {
      itemCategoryName: "",
    },
    validationError: [
      {
        PropertyName: "",
        ErrorMessage: "Provide at least one filter criteria.",
      },
    ],
  },
  {
    description: "Empty Code. @ItemCategoryMasterGetApi",
    save: {
      code: "",
    },
    validationError: [
      {
        PropertyName: "",
        ErrorMessage: "Provide at least one filter criteria.",
      },
    ],
  },
  {
    description: "Empty Code and itemCategoryName. @ItemCategoryMasterGetApi",
    save: {
      itemCategoryName: "",
      code: "",
    },
    validationError: [
      {
        PropertyName: "",
        ErrorMessage: "Provide at least one filter criteria.",
      },
    ],
  },
];

export const searchAPIValidationMessage = [
  {
    description: "Single character in code. @ItemCategoryMasterSearchApi",
    save: {
      code: "a",
    },
    validationError: [
      {
        PropertyName: "Code",
        ErrorMessage: "Provide at least 2 characters for code.",
      },
    ],
  },
   {
    description: "Single Character in itemCategoryName @ItemCategoryMasterSearchApi",
    save: {
      itemCategoryName: "a",
    },
    validationError: [
      {
        PropertyName: "ItemCategoryName",
        ErrorMessage: "Provide at least 2 characters for item category name.",
      },
    ],
  },
];

