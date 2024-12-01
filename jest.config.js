module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // Match test files next to implementation
  testMatch: ["**/?(*.)+(spec|test).ts"],
  // Automatically clear mock calls between every test
  clearMocks: true,
  // Show native output on the terminal through the child process
  verbose: true,
  coveragePathIgnorePatterns: ["/node_modules/"],
  // Module file extensions for importing
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
