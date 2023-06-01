export const getSeatsLeftNum = (item) => {

    if(item?.bookings != []){
      if(JSON.parse(item?.seats).length >= item?.bookings[0]?.booked_seats){
        // 4>2 
        let TSeats = JSON.parse(item?.seats).length
        let BSeats = item?.bookings[0]?.booked_seats
       
        return TSeats - BSeats

      }else{
        return JSON.parse(item?.seats).length
    }

    }else{
      return  JSON.parse(item?.seats).length 
    }

  } 