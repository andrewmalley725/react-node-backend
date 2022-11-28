function convertTime(time){
    let timeOfDay;
    let mins;
    let hours;
    let oString;

    if (time.getHours() >= 12){
        timeOfDay = 'PM';
        
    }
    else{
        timeOfDay = 'AM';
    }

    if (time.getHours() > 12){
        hours = time.getHours() - 12;
    }
    else if(time.getHours() == 0){
        hours = 12;
    }
    else{
        hours = time.getHours();
    }

    if(time.getMinutes() == 0){
        mins = '00';
    }
    else{
        mins = time.getMinutes();
    }

    oString = hours + ':' + mins + timeOfDay;

    return(oString)

}

function getTime(startTime, Duration){
    
    let startTimeString;
    let endTimeString;
    let startTimeArr = startTime.split(':');

    let start = new Date(2022, 0, 1, startTimeArr[0], startTimeArr[1],0,0);
    let end = new Date(start.getTime() + Duration*60000)

    startTimeString = convertTime(start);
    endTimeString = convertTime(end);

    return(startTimeString + '-' + endTimeString)
}

module.exports = { getTime }