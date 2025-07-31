export const saveWithInMaxLength = [
  {
    description: "Save With 1 character.",
    save: {
      userName: "a",
      userTypeNo: 2,
      userProfileId: "a",
      emailId: "a@g.co",
      contactNo: "a",
      employeeId: "a",
      designation: "a",
      departmentId: null,
      reportingManagerName: "a",
      statusNo: 1,
      statusRemarks: "a",
      userMasterBusinessUnitDetail: [],
    },
    expectedResult: true,
  },
  {
    description: "Save With max-1 character.",
    save: {
      userName:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      userTypeNo: 2,
      userProfileId: "aaaaaaaaaaaa",
      emailId:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@g.co",
      contactNo: "aaaaaaaaaaaaaaa",
      employeeId: "aaaaaaaaaaaaaaaaaaaa",
      designation:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      departmentId: null,
      reportingManagerName:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 1,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      userMasterBusinessUnitDetail: [],
    },
    expectedResult: true,
  },
  {
    description: "Save With max character.",
    save: {
      userName:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      userTypeNo: 2,
      userProfileId: "aaaaaaaaaaa",
      emailId:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@g.co",
      contactNo: "aaaaaaaaaaaaaa",
      employeeId: "aaaaaaaaaaaaaaaaaaa",
      designation:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      departmentId: null,
      reportingManagerName:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 1,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      userMasterBusinessUnitDetail: [],
    },
    expectedResult: true,
  },
];

export const exceedCharacterLength = [
  {
    description: "Max +1 Character for userName 100 + 1 character",
    save: {
      userName:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      userTypeNo: 2,
      userProfileId: "aaaa",
      emailId: "aaaa",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 1,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "UserName",
        ErrorMessage: "User Name must be between 1 and 100 characters.",
      },
    ],
  },
  {
    description: "Max +1 Character for userProfileId 12 + 1 character",
    save: {
      userName: "aaaa",
      userTypeNo: 2,
      userProfileId: "aaaaaaaaaaaaa",
      emailId: "aaaa",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 1,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "UserProfileId",
        ErrorMessage: "User Profile Id must be between 1 and 12 characters.",
      },
    ],
  },
  {
    description: "Max +1 Character for emailId 150 + 1 character",
    save: {
      userName: "aaaa",
      userTypeNo: 2,
      userProfileId: "aaaa",
      emailId:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@g.co",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 1,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "EmailId",
        ErrorMessage: "Email Id must be between 1 and 150 characters.",
      },
    ],
  },
  {
    description: "Max +1 Character for contactNo 15 + 1 character",
    save: {
      userName: "aaaa",
      userTypeNo: 3,
      userProfileId: "aaaa",
      emailId: "aaaa",
      contactNo: "aaaaaaaaaaaaaaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 1,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "ContactNo",
        ErrorMessage: "Contact No must be between 1 and 15 characters.",
      },
    ],
  },
  {
    description: "Max +1 Character for employeeId 20 + 1 character",
    save: {
      userName: "aaaa",
      userTypeNo: 2,
      userProfileId: "aaaa",
      emailId: "aaaa",
      contactNo: "aaaa",
      employeeId: "aaaaaaaaaaaaaaaaaaaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 2,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "EmployeeId",
        ErrorMessage: "Employee Id must be between 1 and 12 characters.",
      },
    ],
  },
  {
    description: "Max +1 Character for designation 100 + 1 character",
    save: {
      userName: "aaaa",
      userTypeNo: 2,
      userProfileId: "aaaa",
      emailId: "aaaa",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 1,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "Designation",
        ErrorMessage: "Designation must be between 1 and 50 characters.",
      },
    ],
  },
  {
    description: "Max +1 Character for reportingManagerName 100 + 1 character",
    save: {
      userName: "aaaa",
      userTypeNo: 2,
      userProfileId: "aaaa",
      emailId: "aaaa",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      statusNo: 1,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "ReportingManagerName",
        ErrorMessage:
          "Reporting Manager Name must be between 1 and 100 characters.",
      },
    ],
  },
  {
    description: "Max +1 Character for statusRemarks 300 + 1 character",
    save: {
      userName: "aaaa",
      userTypeNo: 2,
      userProfileId: "aaaa",
      emailId: "aaaa",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 2,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "StatusRemarks",
        ErrorMessage: "Status Remarks must be between 1 and 300 characters.",
      },
    ],
  },
  {
    description: "Max +1 Character for statusRemarks 300 + 1 character with status 1",
    save: {
      userName: "aaaa",
      userTypeNo: 2,
      userProfileId: "aaaa",
      emailId: "aaaa@gmi.cim",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 1,
      statusRemarks:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "StatusRemarks",
        ErrorMessage: "Status Remarks must be between 1 and 300 characters.",
      },
    ],
  },
  {
    description: "For All",
    save: {
      userName: "A".repeat(101),
      userTypeNo: 2,
      userProfileId: "A".repeat(13),
      emailId: "a".repeat(146) + "@m.co",
      contactNo: "1".repeat(16),
      employeeId: "E".repeat(21),
      designation: "D".repeat(101),
      departmentId: 10,
      reportingManagerName: "R".repeat(101),
      statusNo: 1,
      statusRemarks: "S".repeat(301),
      userMasterBusinessUnitDetail: [
        { buId: 1, statusNo: 1, statusRemarks: "Active" },
      ],
    },
    validationError: [
      {
        PropertyName: "UserProfileId",
        ErrorMessage: "User Profile Id must be between 1 and 12 characters.",
      },
      {
        PropertyName: "UserName",
        ErrorMessage: "User Name must be between 1 and 100 characters.",
      },
      {
        PropertyName: "EmailId",
        ErrorMessage: "Email Id must be between 1 and 150 characters.",
      },
      {
        PropertyName: "ContactNo",
        ErrorMessage: "Contact No must be between 1 and 15 characters.",
      },
      {
        PropertyName: "EmployeeId",
        ErrorMessage: "Employee Id must be between 1 and 12 characters.",
      },
      {
        PropertyName: "Designation",
        ErrorMessage: "Designation must be between 1 and 50 characters.",
      },
      {
        PropertyName: "ReportingManagerName",
        ErrorMessage:
          "Reporting Manager Name must be between 1 and 100 characters.",
      },
      {
        PropertyName: "StatusRemarks",
        ErrorMessage: "Status Remarks must be between 1 and 300 characters.",
      },
    ],
  },
];

export const blankMandatoryField = [
  {
    description: "Blank userName",
    save: {
      userName: "",
      userTypeNo: 2,
      userProfileId: "aaaa",
      emailId: "neha@example.com",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 1,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [],
    },
    validationError: [
      {
        PropertyName: "UserName",
        ErrorMessage: "User Name is required.",
      },
    ],
  },
  {
    description: "Blank userProfileId",
    save: {
      userName: "aaaa",
      userTypeNo: 2,
      userProfileId: "",
      emailId: "neha@example.com",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 2,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [],
    },
    validationError: [
      {
        PropertyName: "UserProfileId",
        ErrorMessage: "User Profile Id is required.",
      },
    ],
  },
  {
    description: "Blank emailId",
    save: {
      userName: "aaaa",
      userTypeNo: 3,
      userProfileId: "aaaa",
      emailId: "",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 2,
      statusRemarks: "aaaa",
      userMasterBusinessUnitDetail: [],
    },
    validationError: [
      {
        PropertyName: "EmailId",
        ErrorMessage: "Email Id is required.",
      },
    ],
  },
  {
    description: "Blank statusRemarks",
    save: {
      userName: "aaaa",
      userTypeNo: 3,
      userProfileId: "aaaa",
      emailId: "aaaa",
      contactNo: "aaaa",
      employeeId: "aaaa",
      designation: "aaaa",
      departmentId: 111,
      reportingManagerName: "aaaa",
      statusNo: 2,
      statusRemarks: "",
      userMasterBusinessUnitDetail: [],
    },
    validationError: [
      {
        PropertyName: "EmailId",
        ErrorMessage: "Email Id is not in correct format.",
      },
    ],
  },
];

export const blankNonMandatoryField = [
  {
    description: "Blank contactNo",
    save: {
      userName: "tttt",
      userTypeNo: 2,
      userProfileId: "tttt",
      emailId: "tttt@gmail.com",
      contactNo: "",
      employeeId: "tttt",
      designation: "tttt",
      departmentId: null,
      reportingManagerName: "tttt",
      statusNo: 1,
      statusRemarks: "tttt",
      userMasterBusinessUnitDetail: [],
    },
    expected: true,
  },
  {
    description: "Blank employeeId",
    save: {
      userName: "yyyy",
      userTypeNo: 2,
      userProfileId: "yyyy",
      emailId: "yyy@gmail.com",
      contactNo: "yyyy",
      employeeId: "",
      designation: "yyyy",
      departmentId: null,
      reportingManagerName: "yyyy",
      statusNo: 1,
      statusRemarks: "yyyy",
      userMasterBusinessUnitDetail: [],
    },
    expected: true,
  },
  {
    description: "Blank designation",
    save: {
      userName: "uuuu",
      userTypeNo: 2,
      userProfileId: "uuuu",
      emailId: "uuuu@gmail.com",
      contactNo: "uuuu",
      employeeId: "uuuu",
      designation: "",
      departmentId: null,
      reportingManagerName: "uuuu",
      statusNo: 1,
      statusRemarks: "uuuu",
      userMasterBusinessUnitDetail: [],
    },
    expected: true,
  },
  {
    description: "Blank reportingManagerName",
    save: {
      userName: "oooo",
      userTypeNo: 2,
      userProfileId: "oooo",
      emailId: "ooo@gmail.com",
      contactNo: "oooo",
      employeeId: "oooo",
      designation: "oooo",
      departmentId: null,
      reportingManagerName: "",
      statusNo: 1,
      statusRemarks: "oooo",
      userMasterBusinessUnitDetail: [],
    },
    expected: true,
  },
  {
    description: "All non mandatory filed Blank ",
    save: {
      userName: "zzzz",
      userTypeNo: 2,
      userProfileId: "zzzz",
      emailId: "zzzz@gmail.com",
      contactNo: "",
      employeeId: "",
      designation: "",
      departmentId: null,
      reportingManagerName: "",
      statusNo: 1,
      statusRemarks: "",
      userMasterBusinessUnitDetail: [],
    },
    expected: true,
  },
];
