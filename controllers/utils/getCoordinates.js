import 'dotenv/config';
import axios from 'axios';

export const getCoordinates = async (country, city, street, number) => {

    let coordLat, coordLong;
    const params = [number + ',+', street + ',+', city + ',+', country];
    const endURL = '&key=' + process.env.GOOGLE_API_KEY;
    let geoURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';


    for (let index = 0 ; index < params.length ; index ++) {
        geoURL += params[index];
    }
    geoURL += endURL;

    try {
        await axios.get(geoURL).then(result => {

            coordLat = result.data.results[0].geometry.location.lat;
            coordLong = result.data.results[0].geometry.location.lng;

        }).catch(error => {
            console.log("await catch ERROR");
        })
    } catch (error) {
        console.log('try catch ERROR');
    }

    return {coordLat, coordLong};
    
    // let checker = false;
    // let index = 3;
    // let initialIndex = 0;
    //
    // do {
    //     initialIndex = index;
    //     for (index ; index < params.length ; index ++) {
    //         geoURL += params[index];
    //     }
    //     geoURL += endURL;
    //     console.log(geoURL);


    // //     try {
    //         await axios.get(geoURL).then(result => {
    
    //             coordLat = result.data.results[0].geometry.location.lat;
    //             coordLong = result.data.results[0].geometry.location.lng;
                
    //             if (result.data.status == "ZERO_RESULTS" ) {
    //                 checker = false;
    //             }
                
    //             index = initialIndex;

    //         }).catch(error => {
    //             console.log("await catch ERROR");
    //             index = initialIndex;
    //         })
            
    //     } catch (error) {
    //         console.log('try catch ERROR');
    //     }
    //     index++;
    //     console.log('index before return ' + index);
    //     return {coordLat, coordLong};

    // } while (checker);

    // while ( checker ) {
    //     let initialIndex = index;
    //     for (index ; index < params.length ; index ++) {
    //         geoURL += params[index];
    //     }
    //     geoURL += endURL;
    //     console.log(geoURL);


    //     try {
    //         await axios.get(geoURL).then(result => {
    
    //             coordLat = result.data.results[0].geometry.location.lat;
    //             coordLong = result.data.results[0].geometry.location.lng;
                
    //             if (result.data.results[0] === undefined ) {
    //                 checker = false;
    //             }
    //             index = initialIndex;
    //             console.log('checker inside: ' + checker);
    //         }).catch(error => {
    //             console.log('error-------');
    //         })
            
    //     } catch (error) {
    //         console.log('error--------------');
    //     }
    //     console.log('checker outside:' + checker);
    //     index--;
    //     console.log(index);
    //     return {coordLat, coordLong};

    // }


}

