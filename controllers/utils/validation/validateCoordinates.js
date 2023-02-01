export const validateCoordinates = (lat, long) => {

    const regexExp = /^((\-?|\+?)?\d+(\.\d+)?),\s*((\-?|\+?)?\d+(\.\d+)?)$/gi;


    if (!regexExp.test(lat.toString() + ',' + long.toString()) || isNaN(lat) || isNaN(long) || lat < 43.618879 || lat > 48.265003 || long < 20.261889 || long > 29.716697) {
        return false;
    } return true;

}