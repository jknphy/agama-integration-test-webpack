// This is an example file for running Agama integration tests using Puppeteer.
// If the test fails it saves the page screenshot and the HTML page dump to
// ./log/ subdirectory. For more details about customization see the README.md
// file.

// see https://nodejs.org/docs/latest-v20.x/api/test.html

import { parse } from "./lib/cmdline";
import { test_init } from "./lib/helpers";

import { editRootUser } from "./checks/root_authentication";
import { enterRegistration } from "./checks/registration";
import { logIn } from "./checks/login";
import { performInstallation } from "./checks/installation";
import { productSelection, productSelectionWithLicense } from "./checks/product_selection";
import { selectPatterns } from "./checks/software_selection";

function commaSeparatedList(value) {
  return value.split(",");
}

// parse options from the command line
const options = parse((cmd) =>
  cmd
    .option("--product-id <id>", "Product id to select a product to install", "none")
    .option(
      "--accept-license",
      "Accept license for a product with license (the default is a product without license)",
    )
    .option("--registration-code <code>", "Registration code")
    .option("--install", "Proceed to install the system (the default is not to install it)")
    .option("--patterns <pattern>,<pattern>...", "comma separated patterns", commaSeparatedList),
);

test_init(options);
logIn(options.password);
if (options.productId !== "none")
  if (options.acceptLicense) productSelectionWithLicense(options.productId);
  else productSelection(options.productId);
if (options.registrationCode) enterRegistration(options.registrationCode);
if (options.patterns) selectPatterns(options.patterns);
editRootUser(options.rootPassword);
if (options.install) performInstallation();
