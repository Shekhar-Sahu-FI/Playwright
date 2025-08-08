export const saveWithInMaxLength = [
  {
    description: "Save With 1 character. @MakeMasterAPI",
    save: {
      code: "a",
      makeName: "a",
      statusNo: 2,
      statusRemarks: "a",
    },
    expectedResult: true,
  },
  {
    description: "Save With max-1 character. @MakeMasterAPI",
    save: {
      code: "aaaaaa",
      makeName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
  {
    description: "Save With max character length.@MakeMasterAPI",
    save: {
      code: "aaaaa",
      makeName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
];

export const exceedCharacterLength = [
  {
    description: "Max +1 Character for code 6 + 1 character @MakeMasterAPI",
    save: {
      code: "aaaaaaa",
      makeName: "qqqq",
      statusNo: 1,
      statusRemarks: "qqqq",
    },
    validationError: [
      {
        PropertyName: "Code",
        ErrorMessage: "Code must be between 1 and 6 characters."
      },
    ],
  },
  {
    description: "Max +1 Character for makeName 100 + 1 character @MakeMasterAPI",
    save: {
      code: "qqqq",
      makeName: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 1,
      statusRemarks: "",
    },
    validationError: [
      {
        PropertyName: "MakeName",
        ErrorMessage: "Make Name must be between 1 and 100 characters."
      },
    ],
  },
  {
    description: "Max +1 Character for statusRemarks 300 + 1 character @MakeMasterAPI",
    save: {
      makeName: "qqqq",
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
    description: "Max +1 Character for statusRemarks 300 + 1 character @MakeMasterAPI",
    save: {
      makeName: "qqqq",
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
    description: "Blank makeName @MakeMasterAPI",
    save: {
      makeName: "",
      code: "qqqq",
      statusNo: 1,
      statusRemarks: "qqqq",
    },
    validationError: [
      {
        PropertyName: "MakeName",
        ErrorMessage: "Make Name is required.",
      },
    ],
  },
  {
    description: "Blank code @MakeMasterAPI",
    save: {
      makeName: "wwww",
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
    description: "Blank statusRemarks @MakeMasterAPI",
    save: {
      makeName: "rrrr",
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
    description: "Empty Json @MakeMasterGetAPI",
    save: {},
    validationError: [
      {
        PropertyName: "",
        ErrorMessage: "Provide at least one filter criteria.",
      },
    ],
  },
  {
    description: "Single character in code. @MakeMasterGetAPI",
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
    description: "Single Character in makeName @MakeMasterAPI",
    save: {
      makeName: "a",
    },
    validationError: [
      {
        PropertyName: "MakeName",
        ErrorMessage: "Provide at least 2 characters for make name.",
      },
    ],
  },
  {
    description: "Empty makeName @MakeMasterGetAPI",
    save: {
      makeName: "",
    },
    validationError: [
      {
        PropertyName: "",
        ErrorMessage: "Provide at least one filter criteria.",
      },
    ],
  },
  {
    description: "Empty Code. @MakeMasterGetAPI",
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
    description: "Empty Code and makeName. @MakeMasterGetAPI",
    save: {
      makeName: "",
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
