/**
 * This regex pattern is using the official standard: RFC5322. More details: https://www.ietf.org/rfc/rfc5322.txt
 *
 * Reference: https://emailregex.com/
 */
export const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Reference: https://stackoverflow.com/a/19605207
 *
 * TLDR: at least 8 characters, one number, one capital letter, one "small" letter and one special character
 */
export const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,128}$/;
