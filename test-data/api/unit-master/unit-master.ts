export const saveWithInMaxLength = [
  {
    description: "Save With 1 character. @UnitMasterAPI",
    save: {
      code: "a",
      unitName: "a",
      statusNo: 2,
      statusRemarks: "a",
    },
    expectedResult: true,
  },
  {
    description: "Save With max-1 character. @UnitMasterAPI",
    save: {
      code: "aaaaaa",
      unitName: "aaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
  {
    description: "Save With max character length.@UnitMasterAPI",
    save: {
      code: "aaaaa",
      unitName: "aaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
];

export const exceedCharacterLength = [
  {
    description: "Max +1 Character for code 6 + 1 character @UnitMasterAPI",
    save: {
      code: "aaaaaaa",
      unitName: "qqqq",
      statusNo: 1,
      statusRemarks: "qqqq",
    },
    validationError: [
      {
        PropertyName: "UnitName",
        ErrorMessage: "Code must be between 1 and 6 characters."
      },
    ],
  },
  {
    description: "Max +1 Character for unitName 25 + 1 character @UnitMasterAPI",
    save: {
      code: "qqqq",
      unitName: "aaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 1,
      statusRemarks: "",
    },
    validationError: [
      {
        PropertyName: "UnitName",
        ErrorMessage: "Unit Name must be between 1 and 25 characters."
      },
    ],
  },
  {
    description: "Max +1 Character for statusRemarks 300 + 1 character @UnitMasterAPI",
    save: {
      unitName: "qqqq",
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
    description: "Max +1 Character for statusRemarks 300 + 1 character @UnitMasterAPI",
    save: {
      unitName: "qqqq",
      code: "qqqq",
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
    description: "Blank unitName @UnitMasterAPI",
    save: {
      unitName: "",
      code: "qqqq",
      statusNo: 1,
      statusRemarks: "qqqq",
    },
    validationError: [
      {
        PropertyName: "UnitName",
        ErrorMessage: "Unit Name is required.",
      },
    ],
  },
  {
    description: "Blank code @UnitMasterAPI",
    save: {
      unitName: "wwww",
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
    description: "Blank statusRemarks @UnitMasterAPI",
    save: {
      unitName: "rrrr",
      code: "rrrr",
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
    description: "Empty Json @UnitMasterAPI",
    save: {},
    validationError: [
      {
        PropertyName: "",
        ErrorMessage: "Provide at least one filter criteria.",
      },
    ],
  },
  {
    description: "Single character in code. @UnitMasterAPI",
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
    description: "Single Character in unitName @UnitMasterAPI",
    save: {
      unitName: "a",
    },
    validationError: [
      {
        PropertyName: "UnitName",
        ErrorMessage: "Provide at least 2 characters for unit name.",
      },
    ],
  },
  {
    description: "Empty unitName @UnitMasterAPI",
    save: {
      unitName: "",
    },
    validationError: [
      {
        PropertyName: "",
        ErrorMessage: "Provide at least one filter criteria.",
      },
    ],
  },
  {
    description: "Empty Code. @UnitMasterAPI",
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
    description: "Empty Code and unitName. @UnitMasterAPI",
    save: {
      unitName: "",
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
