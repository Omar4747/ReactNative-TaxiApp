import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/Header';
import SuperText from '../../../components/SuperText';
import {colors} from '../../../res/colors';
import {wp} from '../../../res/constants';
import Spacer from '../../../components/Spacer';
import {styles} from './styles';
import {images} from '../../../res/images';
import Button from '../../../components/Button';
import DashedLine from 'react-native-dashed-line';
import {allTripsAction} from '../../../redux/actions/allTripsAction';
import {useSelector, useDispatch} from 'react-redux';
import {selectUser, selectUserType} from '../../../redux/slices/userSlice';
import {useEffect} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native'
import { AppModal } from '../../../components/AppModal';
import { useCallback } from 'react';

const Items = props => {
  return (
    <View style={styles.row}>
      <Image source={props.icon} />
      <SuperText
        style={{width: wp(70)}}
        color={colors.black}
        semiBold
        size={wp(4.5)}
        value={props.title}
      />
      <Image source={images.rightArrow} />
    </View>
  );
};

const Trips = props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused()


  const userData = useSelector(selectUser);
  const userType = useSelector(selectUserType);
  console.log("----userType trips screen ----", userType.type)
  const myUser = userData?.data?.user

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Active');
  const [displayingList, setDisplayingList] = useState([]);
  const [dataList, setDataList] = useState({});
  const [activeList, setActiveList] = useState([]);
  const [recentList, setRecentList] = useState([]);
  const [canceledList, setCanceledList] = useState([]);
  const [myData, setMyData] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalText, setModalText] = useState({});

  useEffect(() => {
    getAllTrips()
  }, [selectedTab, isFocused]);


  const getAllTrips = () =>{
    try {
      const data = {
        token: userData?.data?.token,
        user_type: userType.type.toLowerCase(),
      };
      dispatch(allTripsAction(data))
        .unwrap()
        .then(result => {
          // console.log(
          //   '---- allTripsAction active default -----',
          //   JSON.s\tringify(result, null, 2),
          // );
          if(selectedTab==="Active"){
            setDisplayingList(result?.data?.trips?.active);
  
          }
          console.log("-------active---------", result?.data?.trips?.active)
          console.log("-------complete---------", result?.data?.trips?.complete)
          console.log("-------canceled---------", result?.data?.trips?.canceled?.length)
          // console.log("-------active bbb---------", result?.data?.trips?.active[0]?.bookings[0])
          // console.log("-------active bbb---------", result?.data?.trips?.active[0]?.bookings[0]?.booked_seats)
  
          let obj = {
            active: result?.data?.trips?.active,
            recent: result?.data?.trips?.complete,
            canceled: result?.data?.trips?.canceled
          }
          // setActiveList(result?.data?.trips?.active);
          // setRecentList(result?.data?.trips?.complete);
          // setCancelledList(result?.data?.trips?.canceled);
          setDataList(obj)
          setLoading(false);
        })
        .catch(error => {
          setLoading(false);
        });
      } catch (error) {
        console.log('---- trips catch error -----', error);
        
      }
  }

  const onOkPress=()=>{
    setIsModalVisible(false)
    // props.navigation.navigate("TripStack")
  }

  const tripModal =(title, subtitle)=>{
    setIsModalVisible(true)
    setModalText({title: title, subtitle: subtitle})

  }

  const onTabClicked = useCallback(tabClicked => {
    // console.log("----tab clicked----", tabClicked)
    // setDisplayingList([]);
    if (tabClicked === 'Active') {
      setSelectedTab('Active');
      // console.log("---dataList?.cancelled 1122aa---", dataList?.active)
      setDisplayingList(dataList?.active);
      return
    } else if (tabClicked === 'Recent') {
      setSelectedTab('Recent');
      // console.log("---dataList?.cancelled 1122bb---", dataList?.recent)
      // setDisplayingList(recentList);
      setDisplayingList(dataList?.recent);
      return
    } else if (tabClicked === 'Canceled') {
      setSelectedTab('Canceled');
      // console.log("---dataList?.cancelled 1122cc---", dataList?.canceled)
      setDisplayingList(dataList?.canceled);
    }
  },[])

  const getSeatsLeft = (item) => {

    if(item?.bookings != []){

      if(JSON.parse(item?.seats).length >= item?.bookings[0]?.booked_seats){
        // 4>2 

        let TSeats = JSON.parse(item?.seats).length
        let BSeats = item?.bookings[0]?.booked_seats
       
        return TSeats - BSeats+ " Seats Left"

      }else{
        return JSON.parse(item?.seats).length + " Seats Left"
      }

    }else{
      return JSON.parse(item?.seats).length + " Seats Left"
    }

  }

  const checkPassengerVerification=()=>{
    const isUserValid = myUser?.verification_approve !== "0"
            
            if(isUserValid){
              props.navigation.navigate('FindTrip');

            }else if(myUser?.verification_approve=="0"){
                //Verification has not been approved yet 
                tripModal("Verification Unsuccessful", "Your identity has not been verified by the admin yet.")

            }else{
              //please complete your profile first 
              tripModal("Profile Incomplete", "You have some missing data in profile. Please complete your profile data first.")

            }
  }

  const checkDriverVerification=()=>{
    const isUserValid = myUser?.phone_number
            && myUser?.gender
            && myUser?.date_of_birth && myUser?.verification_approve !== "0";

            if(isUserValid){
              props.navigation.navigate('PostTrip', {data:{},type: "postTrip"});
            }
            else if(myUser?.verification_approve=="0"){
              //Verification has not been approved yet 
              tripModal("Verification Unsuccessful", "Your identity has not been verified by the admin yet.")
            }
            else{
              //please complete your profile first 
                tripModal("Profile Incomplete", "You have some missing data in profile. Please complete your profile data first.")
            }
  }

  const ListEmptyComponent = useCallback(() => (
    <View>
      <Image source={images.carDriving} style={{alignSelf: 'center'}} />
      <Spacer space={wp(4)} />
      <SuperText
        style={{textAlign: 'center'}}
        color={colors.black}
        bold
        size={wp(5)}
        value="Driving or need a ride?"
      />
      <Spacer space={wp(1)} />
      <SuperText
        style={{textAlign: 'center'}}
        color={colors.gray}
        regular
        size={wp(4.5)}
        value="Post a trip or request a ride here"
      />
      <Spacer space={wp(2)} />
      <Button
        onPress={() => {
          setVisible(!visible);

          if(userType.type==="Passenger"){
            checkPassengerVerification()
            // props.navigation.navigate('FindTrip')
          }else{
            // props.navigation.navigate('PostTrip',{data:{},type: "postTrip"}); 
            checkDriverVerification()
          }

        }}
        btnStyle={{width: wp(30), alignSelf: 'center'}}
        label="Let's Go"
      />
    </View>
  ),[])

  const renderItem = ({item}) => (
    // seatsCount == selectedSeats
    <TouchableOpacity
      onPress={() => props.navigation.navigate('TripPreview', {data: item, type:"trips", seatsCount: item?.bookings[0]?.booked_seats, tripStatus:selectedTab})}
      style={styles.itemWrapper}>
      <View style={styles.mapWrapper}>
        <Image source={images.map} style={styles.map} />
      </View>
      <Spacer space={wp(1)} />
      <View style={styles.row}>
        <SuperText
          color={colors.gray}
          semiBold
          size={wp('3.5%')}
          value={item?.date +' at ' + item?.time}
        />
        <View style={styles.row}>
          <SuperText
            color={colors.black}
            bold
            size={wp('3.5%')}
            value={getSeatsLeft(item)}
          />
          <Spacer row={wp(1)} />
          <SuperText
            color={colors.green3}
            bold
            size={wp('3.5%')}
            value={'$' + item?.price}
          />
        </View>
      </View>
      <Spacer space={wp(1)} />
      <View style={[styles.row, {justifyContent: 'flex-start'}]}>
        {/* <View>
          <SuperText color={colors.gray} bold size={wp(4)} value="1:00 PM" />
          <Spacer space={wp(1)} />
          <SuperText color={colors.gray} bold size={wp(4)} value="2:00 PM" />
        </View> */}
        {/* <Spacer row={wp(1)} /> */}
        <Image source={images.line} />
        <Spacer row={wp(1)} />
        <View>
          <SuperText
            color={colors.black}
            semiBold
            size={wp(4)}
            value={item?.pick_up}
          />
          <Spacer space={wp(1)} />
          <SuperText
            color={colors.black}
            semiBold
            size={wp(4)}
            value={item?.drop_off}
          />
        </View>
      </View>
      <Spacer space={wp(2)} />
      <DashedLine dashColor={colors.border3} dashLength={6} />
      <Spacer space={wp(2)} />
      <SuperText
        style={{textAlign: 'center'}}
        color={colors.black}
        semiBold
        size={wp(4.5)}
        // value={item?.booked_seats+" booking"}
        value={item?.bookings[0]?.booked_seats>0 ? item?.bookings[0]?.booked_seats+ (item?.bookings[0]?.booked_seats>1? " bookings":" booking") :"No booking"}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppModal title={modalText.title} hideIcon
            description={modalText.subtitle} 
            onProceed={()=> onOkPress()}  isModalVisible={isModalVisible} />
      <Header
        onPlus={() => {
          // props.navigation.navigate('PostTrip',{data:{},type: "postTrip"});
          checkDriverVerification()
        }}
        // onSearch={() => props.navigation.navigate('SearchTrips')}
        onSearch={() => 
          // props.navigation.navigate('FindTrip')
      checkPassengerVerification()
      }
        profile
      />
      <Spacer space={wp(2)} />
      <View style={styles.subView}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => onTabClicked('Active')}
            style={[
              styles.tabWrapper,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor:
                  selectedTab === 'Active' ? colors.gray4 : 'transparent',
              },
            ]}>
            <SuperText
              color={colors.black}
              semiBold
              size={wp('4.5%')}
              value="Active"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTabClicked('Recent')}
            style={[
              styles.tabWrapper,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor:
                  selectedTab === 'Recent' ? colors.gray4 : 'transparent',
              },
            ]}>
            <SuperText
              color={colors.gray}
              regular
              size={wp(4.5)}
              value="Recent"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onTabClicked('Canceled')}
            style={[
              styles.tabWrapper,
              // eslint-disable-next-line react-native/no-inline-styles
              {
                backgroundColor:
                  selectedTab === 'Canceled' ? colors.gray4 : 'transparent',
              },
            ]}>
            <SuperText
              color={colors.gray}
              regular
              size={wp(4.5)}
              value="Canceled"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Spacer space={wp(2)} />
      {loading ? (
        // eslint-disable-next-line react-native/no-inline-styles
        <ActivityIndicator style={{flex: 1}} size={'small'} color={'grey'} />
      ) : (
        <>
        {selectedTab === 'Canceled' ?
        <FlatList
          data={dataList?.canceled}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        : <></>}

      {selectedTab === 'Active' ?
        <FlatList
          data={dataList?.active}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        : <></>}
      {selectedTab === 'Recent' ?
        <FlatList
          data={dataList?.recent}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        : <></>}

        </>
      )}
    </View>
  );
};

export default Trips;
