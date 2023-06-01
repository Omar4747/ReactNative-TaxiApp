import { View, Text, StatusBar, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import SuperText from '../../../components/SuperText'
import { colors } from '../../../res/colors'
import { wp } from '../../../res/constants'
import Spacer from '../../../components/Spacer'
import { styles } from './styles'
import { images } from '../../../res/images'
import Input from '../../../components/Input'
import { ScrollView } from 'react-native-gesture-handler'
import Button from '../../../components/Button'
import { postTripAction, updateTripDetailsAction } from '../../../redux/actions/postTripAction'
import { useDispatch, useSelector } from 'react-redux'
import { selectUser } from '../../../redux/slices/userSlice'
import { vehicleListAction } from '../../../redux/actions/VehicleListAction'
import { colourListData, citiesData } from '../../../constants/data'
import { tripPreviewAction } from '../../../redux/actions/allTripsAction'
import { AppModal } from '../../../components/AppModal'

const PostTrip = (props) => {
    const {type, data} = props.route.params
    const dispatch = useDispatch()
    const userData = useSelector(selectUser);

    // console.log("----data data posttrip----", type)
    // console.log("----data data posttrip----", JSON.stringify(data))
    const [previewData, setPreviewData] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleDest, setVisibleDest] = useState(false);
    const [visiblePickup, setVisiblePickup] = useState(false);
    const [visibleDropOff, setVisibleDropOff] = useState(false);
    const [visibleCar, setVisibleCar] = useState(false);
    const [colorVisible, setColorVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState(false);
    const [tripData, setTripData] = useState({})
    const [vehicleList, setVehicleList] = useState([])
    const [source, setSource] = useState('')
    const [destination, setDestination] = useState('')
    const [dropOff, setDropOff] = useState( '')
    const [pickup, setPickup] = useState('')
    const [date, setDate] = useState('')
    const [time, setTime] = useState('')
    const [year, setYear] = useState('')
    const [plateNum, setPlateNum] = useState('')
    const [selectedVehicle, setSelectedVehicle] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingVehicle, setIsLoadingVehicle] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const [loader, setLoader] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [modalText, setModalText] = useState({});

    useEffect(()=>{
        getVehicles()
    },[userData])

    useEffect(()=>{
        if(type=="editTrip"){

        setLoader(true);

        let obj = {
          token : userData?.data?.token,
          id: data?.trip[0]?.id
        }

        console.log("----allTripsAction obj-----")
        
        dispatch(tripPreviewAction(obj))
        .unwrap()
        .then(result => {
            // navigation.replace('SuccessScreen');
            // console.log("----allTripsAction obj 550055-----", result?.data?.trip[0])
          setLoader(false);
        //   setDatam(result?.data)
        let datam = result?.data
        if(type=="editTrip"){
            setSource({value:datam?.trip[0]?.city})
            setDestination({value:datam?.trip[0]?.destination})
            setDropOff({value:datam?.trip[0]?.drop_off})
            setPickup({value:datam?.trip[0]?.pick_up})
            setDate(datam?.trip[0]?.date)
            setTime(datam?.trip[0]?.time)
            setSelectedVehicle(datam?.trip[0]?.vehicle)
        }
          setPreviewData(result?.data?.trip[0])

        //   console.log("----rem rem seats 009988-----", result?.data?.total_seats)
        //   console.log("----allTripsAction obj-----", result?.data?.trip[0])
          
        //   console.log(
        //     '---- allTripsAction active default 7009 -----',
        //     JSON.stringify(result, null, 2),
        //   );
        })
        .catch(error => {
          setLoader(false);
          // console.log('---- allTripsAction error -----', error);
        });
    }

      }, [])

    const getVehicles = () =>{
        setIsLoadingVehicle(true)
        // console.log("----userToken getVehicles----")
        console.log("----userToken----", userData.data?.token)
        const data ={
            token: userData.data?.token
        }
        dispatch(vehicleListAction(data)).unwrap().then((result)=>{
            console.log("----Vehicle list result---", result?.data)
            setIsLoadingVehicle(false)
            setVehicleList(result?.data?.vehicle)
            // props.navigation.navigate("TripDetails")
        }).catch((error)=>{
            setIsLoadingVehicle(false)
            console.log("----postTripAction error---", error)
        })
    }

    const tripModal =(title, subtitle)=>{
        setIsModalVisible(true)
        setModalText({title: title, subtitle: subtitle})
    
      }

      const onOkPress=()=>{
        setIsModalVisible(false)
        props.navigation.navigate("TripStack")
      }
    

      

    const updatePostTrip = () =>{
        const inputTime = time;

        const dateT = new Date();
        dateT.setHours(
          parseInt(inputTime.substr(0, 2)), // hours (08)
          parseInt(inputTime.substr(3, 2)), // minutes (48)
          0, // seconds (0)
          inputTime.substr(6, 2) === 'am' ? 0 : 12 // 0 for AM, 12 for PM
        );
        
        // Format the date as "HH:mm:ss"
        const formattedTime = ('0' + dateT.getHours()).slice(-2) + ':' +
          ('0' + dateT.getMinutes()).slice(-2) + ':' +
          ('0' + dateT.getSeconds()).slice(-2);

        let updateTripData = {
            'vehicle_id': selectedVehicle?.id,
            'city': source?.value,
            'destination': destination?.value, 
            'pick_up': pickup?.value, 
            'drop_off': dropOff?.value, 
            'total_seats': selectedVehicle?.total_seats, 
            // 'price': '100', 
            // seats: [1,3],
            'date': date,
            'time': formattedTime,
          }
          let datam ={
            token: userData.data?.token,
            tripData: updateTripData,
            id: data?.trip[0]?.id,
        }
        // console.log("----updateTripData datadata 009932a---", JSON.stringify(datam, null, 2))

          dispatch(updateTripDetailsAction(datam)).unwrap().then((result)=>{
            // console.log("----updateTripData result 009932a---", result?.data?.trip)
            // console.log("----updateTripData Success---")

            if(result?.success){
                console.log("----200---")
                setIsLoadingVehicle(false)
                tripModal("Trip Updated", "Your trip has been updated.")
                // result?.data?.trip?.is_open=true
                // props.navigation.navigate("SuccessScreen", {data:{ data: result?.data, screen: "TripStack"}})
            }else{

                // console.log("----404---", result)
                let obj={
                    form: result?.data?.message?  result?.data?.message : "Something went wrong!!"
                }
                setErrorMsg(obj)
            }
        }).catch((error)=>{
            setIsLoadingVehicle(false)
            // console.log("----5001---", error?.response?.data?.data?.error)
            let obj={
                form: error?.response?.data?.data ? error?.response?.data?.data?.error: "Something went wrong!!"
            }
            setErrorMsg(obj)
            // console.log("----updateTripData error---", error.response.data)
        })


    }


    const continuePostTrip = () =>{

        let postTripData = {
            'vehicle_id': selectedVehicle?.id,
            'city': source?.value,
            'destination': destination?.value, 
            'pick_up': pickup?.value, 
            'drop_off': dropOff?.value, 
            'total_seats': selectedVehicle?.total_seats, 
            // 'price': '100', 
            // seats: [1,3],
            'date': date,
            'time': time,
          }

        //   console.log("---data postTripData 009932---", postTripData)
        //   let data = {
        //     token: userData.data?.token,
        //     tripData: postTripData,
        //   }

          if(selectedVehicle && pickup?.value && dropOff?.value && date && time){

              props.navigation.navigate("EmptySeats", {data: postTripData, type: type})
              
          }else{
            if(vehicleList?.length===0){
                let obj={
                    vehicle: "No vehicle found."
                }
                setErrorMsg(obj)
            }else{
                let obj={
                    form: "Please fill all fields properly."
                }
                setErrorMsg(obj)
            }
          }
        
          //   props.navigation.navigate("TripDetails", {data: data})


        // dispatch(postTripAction(data)).unwrap().then((result)=>{
        //     console.log("----postTripAction result---", result)
        //     props.navigation.navigate("TripDetails")
            
        // }).catch((error)=>{
        //     console.log("----postTripAction error---", error)
        // })

    }



    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content' />
            <AppModal title={modalText.title} 
            description={modalText.subtitle} 
            onProceed={()=> onOkPress()}  isModalVisible={isModalVisible} />
            <Header onPressLeft={() => props.navigation.pop()} shadow leftIcon={images.leftArrow} label="Trip Details" />
            <ScrollView enableOnAndroid showsVerticalScrollIndicator={false}>
                <Spacer space={wp(2)} />
                {/* <Input leftIcon={images.location} label="Source" placeholder="City" /> */}
                <Input
                    visible={visible}
                    leftIcon={images.location}
                    label="Source"
                    rightPress={() => setVisible(!visible)}
                    select
                    value={source?.value}
                    rightIcon={images.arrowDown}
                    placeholder="-Select Source-"
                    datam={citiesData}
                    type={"city"}
                    selectedItem={(val)=>{
                        // console.log("---source----",val)
                        setSource(val)
                        setVisible(false)
                    }}
                />
                {/* <Input leftIcon={images.location} label="Destination" placeholder="City" /> */}
                <Input
                    visible={visibleDest}
                    leftIcon={images.location}
                    label="Destination"
                    rightPress={() => setVisibleDest(!visibleDest)}
                    select
                    value={destination?.value}
                    rightIcon={images.arrowDown}
                    placeholder="-Select Destination-"
                    datam={citiesData}
                    type={"city"}
                    selectedItem={(val)=>{
                        // console.log("---dest----",val)
                        setDestination(val)
                        setVisibleDest(false)
                    }}
                />
                {source &&
                // <Input leftIcon={images.location} label="Pick up" placeholder="Enter a source" />
                <Input
                    visible={visiblePickup}
                    leftIcon={images.location}
                    label="Pick up"
                    rightPress={() => setVisiblePickup(!visiblePickup)}
                    select
                    value={pickup?.value}
                    rightIcon={images.arrowDown}
                    placeholder="Enter a source"
                    datam={source?.places}
                    type={"place"}
                    selectedItem={(val)=>{
                        setPickup(val)
                        setVisiblePickup(false)
                    }}
                />
                }
                {destination &&
                // <Input leftIcon={images.location} label="Drop off" placeholder="Enter a destination" />
                <Input
                    visible={visibleDropOff}
                    leftIcon={images.location}
                    label="Drop off"
                    rightPress={() => setVisibleDropOff(!visibleDropOff)}
                    select
                    value={dropOff?.value}
                    rightIcon={images.arrowDown}
                    placeholder="Enter a destination"
                    datam={destination?.places}
                    type={"place"}
                    selectedItem={(val)=>{
                        setDropOff(val)
                        setVisibleDropOff(false)
                    }}
                />
                 }
                <View style={styles.row}>
                    <Input mode="date" date containerStyle={{ width: wp(50) }} leftIcon={images.calender} label="Date" placeholder="Enter date" value={date} selectedDate={(val)=> setDate(val)} />
                    <Input mode="time" date containerStyle={{ width: wp(50) }} leftIcon={images.time} label="Time" placeholder="Enter time" value={time} selectedTime={(val)=> setTime(val)}/>
                </View>
                <View style={{ paddingHorizontal: wp(4), marginVertical: wp(2) }}>
                    <SuperText value="Vehicle details" bold color={colors.black} size={wp(5)} />
                    <Spacer space={wp(0.5)} />
                    <SuperText value="This helps you get more bookings and makes it easier for passengers to identify your vehicle." regular color={colors.gray} size={wp(4)} />
                    <Spacer space={wp(2)} />
                    {/* <View style={styles.addPhoto}>
                        <Image source={images.addPhoto} />
                    </View> */}
                </View>
                <SuperText style={{ paddingHorizontal: wp(4), }} value="Saved cars" bold color={colors.black} size={wp(5)} />
                {isLoadingVehicle && (<View><ActivityIndicator/></View> )}
                {!isLoadingVehicle && vehicleList?.length==0 ?((<View><Text style={{color:"red", marginLeft:20, marginBottom:20}}>No vehicle found!</Text></View>) ): <></>}
                {vehicleList?.length >0 ?<Input
                    visible={visibleCar}
                    rightPress={() => setVisibleCar(!visibleCar)} 
                    select
                    value={selectedVehicle?.model}
                    rightIcon={images.arrowDown}
                    placeholder="- Select -"
                    datam={vehicleList}
                    type={"car"}
                    selectedItem={(val)=>{
                        setSelectedVehicle(val)
                        setVisibleCar(false)
                    }}
                />: <></>
                }
                {/* <Input
                    visible={colorVisible}
                    rightPress={() => setColorVisible(!colorVisible)}
                    select
                    color
                    value={selectedColor?.value}
                    rightIcon={images.arrowDown}
                    label="Colour"
                    datam={colourListData}
                    placeholder="- Select -"
                    selectedItem={(val)=>{
                        setSelectedColor(val)
                        setColorVisible(false)
                    }}
                /> */}
                {/* <Input label="Year" placeholder="YYYY" value={year} onChangeText={(val)=>{setYear(val)}}/> */}
                {/* <Input label="Licence Plate" placeholder="POP 123" onChangeText={(val)=>{setPlateNum(val)}} /> */}
                {/* <View style={{ paddingHorizontal: wp(4) }}>
                    <SuperText semiBold value="Luggage" color={colors.black} style={{ fontSize: wp(4.4) }} />
                    <Spacer space={wp(2)} />
                    <View style={styles.luggage}>
                        <View style={styles.luggageWrapper}>
                            <TouchableOpacity style={[styles.row, { justifyContent: 'flex-start', backgroundColor: colors.primary, padding: wp(2), borderTopLeftRadius: wp(2), borderBottomLeftRadius: wp(2) }]}>
                                <Image source={images.luggage} style={{ tintColor: colors.white }} />
                                <Spacer row={wp(1)} />
                                <SuperText semiBold value="No Luggage" color={colors.white} style={{ fontSize: wp(4) }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.row, { justifyContent: 'flex-start', paddingHorizontal: wp(4), padding: wp(2), borderRightWidth: 1, borderColor: colors.border }]}>
                                <Image source={images.luggage} />
                                <Spacer row={wp(1)} />
                                <SuperText semiBold value="S" color={colors.gray7} style={{ fontSize: wp(4) }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.row, { justifyContent: 'flex-start', paddingHorizontal: wp(4), padding: wp(2), borderRightWidth: 1, borderColor: colors.border }]}>
                                <Image source={images.luggage} />
                                <Spacer row={wp(1)} />
                                <SuperText semiBold value="M" color={colors.gray7} style={{ fontSize: wp(4) }} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.row, { justifyContent: 'flex-start', paddingHorizontal: wp(4) }]}>
                                <Image source={images.luggage} />
                                <Spacer row={wp(1)} />
                                <SuperText semiBold value="L" color={colors.gray7} style={{ fontSize: wp(4) }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> */}
                {errorMsg?.form ? <View style={{marginLeft:20, marginTop:16}}><Text style={{color:'red'}}>{errorMsg?.form}</Text></View> : <></>}
                
                {type==="editTrip"?
                <Button loading={isLoading} label="Update Trip" onPress={() => updatePostTrip()} btnStyle={{ alignSelf: 'center', marginVertical: wp(4) }} />:
                <Button loading={isLoading} label="Continue" onPress={() => continuePostTrip()} btnStyle={{ alignSelf: 'center', marginVertical: wp(4) }} />
                }
            </ScrollView >
        </View >
    )
}

export default PostTrip