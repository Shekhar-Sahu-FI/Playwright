export const saveWithInMaxLength = [
  {
    description: "Save With 1 character.",
    save: {
      unitName: "a",
      code: "a",
      statusNo: 2,
      statusRemarks: "a",
    },
    expectedResult: true,
  },
  {
    description: "Save With max-1 character.",
    save: {
      unitName: "aaaaaa",
      code: "aaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
  {
    description: "Save With max character.",
    save: {
      unitName: "aaaaa",
      code: "aaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    expectedResult: true,
  },
];

export const exceedCharacterLength = [
  {
    description: "Max +1 Character for unitName 6 + 1 character",
    save: {
      unitName: "aaaaaaa",
      code: "qqqq",
      statusNo: 1,
      statusRemarks: "qqqq",
    },
    validationError: [
      {
        PropertyName: "Add Field",
        ErrorMessage: "Add Message",
      },
    ],
  },
  {
    description: "Max +1 Character for code 25 + 1 character",
    save: {
      unitName: "qqqq",
      code: "aaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 1,
      statusRemarks: "qqqq",
    },
    validationError: [
      {
        PropertyName: "Add Field",
        ErrorMessage: "Add Message",
      },
    ],
  },
  {
    description: "Max +1 Character for statusRemarks 300 + 1 character",
    save: {
      unitName: "qqqq",
      code: "qqqq",
      statusNo: 1,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
    validationError: [
      {
        PropertyName: "Add Field",
        ErrorMessage: "Add Message",
      },
    ],
  },
];

export const blankMandatoryField = [
  {
    description: "Blank unitName",
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
    description: "Blank code",
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
    description: "Blank statusRemarks",
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
