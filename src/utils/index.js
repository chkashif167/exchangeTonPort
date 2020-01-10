export function formatDate(date) {
    var d = new Date(date);
    var month = "" + (d.getMonth() + 1);
    var day = "" + d.getDate();
    var year = d.getFullYear();
  
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
  
    return [day, month, year].join("/");
  }
  
  export function parseDate(dateString) {
    // dd//mm//yyyy
    try {
      var array = dateString.split("/");
      var day = array[0];
      var month = array[1];
      var year = array[2];
      return Date.parse(year + "-" + month + "-" + day);
    } catch (err) {
      console.log("pareDate err", err);
      return "";
    }
  }
  