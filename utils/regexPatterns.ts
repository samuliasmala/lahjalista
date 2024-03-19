/**
 * This regex pattern is using the official standard: RFC5322. More details: https://www.ietf.org/rfc/rfc5322.txt
 * Reference: https://emailregex.com/
 */
export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
