var Player = function(id, username, chips, tableIndex)
{
  var username = username || "INVALIDUSER"
  var password, statistics;
  var chips = chips || 0 ;
  var tableIndex = tableIndex;
  var id;

  var getUsername = function()
  {
    return username;
  }

  var getPassword = function()
  {
    return password;
  }

  var getChips = function()
  {
    return chips;
  }

  var getTableIndex = function()
  {
    return tableIndex;
  }

  var setUsername = function(user)
  {
    username = user;
  }

  var setPassword = function(pw)
  {
    password = pw;
  }

  var addChips = function(numChips)
  {
    chips += numChips;
  }

  var setTableIndex = function(index)
  {
    tableIndex = index;
  }

  return {
		getUsername: getUsername,
		getPassword: getPassword,
    getChips: getChips,
    getTableIndex: getTableIndex,
		setUsername: setUsername,
		setPassword: setPassword,
    addChips: addChips,
    setTableIndex: setTableIndex,
		id: id
	}
}
