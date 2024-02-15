/**
 * @function removeExtraSpace
 * @description function to remove extra spaces from string
 * @param (str)
 * @author Akshay
 */
exports.removeExtraSpace = (str) => {
  const newString = str.replace(/\s+/g, ' ');
  const trimmedString = newString.trim();
  return trimmedString;
};

/**
 * @function currentDateTime
 * @description function to return current IST date time
 * @param ()
 * @author Akshay
 */
exports.currentDateTime = () => {
  const date = new Date();
  const newDate = new Date(
    date.getTime() + date.getTimezoneOffset() * 60 * 1000 * -1
  );
  return newDate;
};
