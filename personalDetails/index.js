import {
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../components/Header';
import SuperText from '../../../components/SuperText';
import {colors} from '../../../res/colors';
import {hp, wp} from '../../../res/constants';
import Spacer from '../../../components/Spacer';
import {styles} from './styles';
import {images} from '../../../res/images';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import {genderList} from '../../../constants/data';
import {selectUser} from '../../../redux/slices/userSlice';
import {useDispatch, useSelector} from 'react-redux';
// import {updateProfileDetailAction} from '../../../redux/actions/updateProfileAction';
import moment from 'moment'
import {
  updateNumberAction,
  updateProfileDetailAction,
} from '../../../redux/actions/updateProfileAction';

const PersonalDetails = props => {
  // let paramsData = props?.route?.params?.data
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const userData = useSelector(selectUser);
  // console.log("---userData personalDetss----",userData)
  const [visible, setVisible] = useState(false);
  const name = userData?.data?.user?.name?.split(' ');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [gender, setGender] = useState(
    userData?.data?.user?.gender?.toUpperCase(
      userData?.data?.user?.gender.charAt(0),
      ),
      );
      const [firstName, setFirstName] = useState(name[0]);
      const [lastName, setLastName] = useState(name[1]);
      const DOB = userData?.data?.user?.date_of_birth==="undefined"? "YYYY-MM-DD": moment(userData?.data?.user?.date_of_birth).format('YYYY-MM-DD');

  const [description, setDescription] = useState(
    userData?.data?.user?.description,
  );

  const [dateOfBirth, setDateOfBirth] = useState(
    DOB 
  );

  const [phoneNumber, setPhoneNumber] = useState();
  const [changePhoneClick, setChangePhoneClick] = useState(false);

  // console.log(
  //   '---- profileDetaill default -----',
  //   JSON.stringify(userData?.data?.user, null, 2),
  // );

  const changePhone = () => {
    setChangePhoneClick(!changePhoneClick);
  };

  const updatePhoneFun = () => {
    setLoading(true);
    const data = {
      token: userData?.data?.token,
      phoneNumber: phoneNumber,
    };
    dispatch(updateNumberAction(data))
      .unwrap()
      .then(result => {

        if(result.success){
          props?.navigation?.goBack();
          console.log(JSON.stringify(result, null, 2));
          alert(result?.message);
        }else{

        }
       
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  const updateProfile = async () => {
    setLoading(true);
    const data = {
      userData: userData,
      token: userData?.data?.token,
      name: firstName + ' ' + lastName,
      description: description,
      gender: gender?.value || gender,
      date_of_birth: moment(dateOfBirth).format('YYYY-MM-DD'),
    };
    // console.log("------data personalDetss 0-------", data)
    await dispatch(updateProfileDetailAction(data))
      .unwrap()
      .then(result => {

        if(result.success){
          alert(result?.message);

          props.navigation.goBack();

        }else{

        }

        // console.log(
        //   '---- profileDetaill default -----',
        //   JSON.stringify(result?.data, null, 2),
        // );
        
      })
      .catch(error => {
        console.log('---- findTripsAction error -----', error);
      });
    setLoading(false);
  };

  const enableButtonfun = () => {
    if (!changePhoneClick) {
      if (!firstName || !lastName || !gender || !description || !dateOfBirth) {
        return true;
      }
      return false;
    } else {
      return !phoneNumber ? true : false;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header
        onPressLeft={() => props.navigation.goBack()}
        shadow
        leftIcon={images.leftArrow}
        label="Personal details"
      />
      <ScrollView>
        <Spacer space={wp(2)} />
        <View style={styles.subView}>
          <View style={styles.row}>
            <View>
              <SuperText
                value="Phone number"
                color={colors.black}
                semiBold
                size={wp(4.4)}
              />
              <Spacer space={wp(0.5)} />
              <SuperText
                // value="+91 987 654 3210"
                value={userData?.data?.user?.phone_number}
                color={colors.gray}
                semiBold
                size={wp(3.5)}
              />
            </View>
            <TouchableOpacity onPress={changePhone}>
              <SuperText
                value={!changePhoneClick ? 'Change' : 'Back'}
                color={colors.primary}
                semiBold
                size={wp(4)}
              />
            </TouchableOpacity>
          </View>
          <Spacer space={wp(1)} />
          <View style={styles.bg}>
            {/* <SuperText
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi imperdiet ante nec enim feugiat, in viverra quam gravida."
              color={colors.gray}
              regular
              size={wp(4)}
            /> */}
          </View>
        </View>
        {changePhoneClick ? (
          <Input
            keyboardType={'numeric'}
            labelColor={colors.gray}
            onChangeText={val => setPhoneNumber(val.replace(/[^0-9]/g, ''))}
            value={phoneNumber}
            label="Phone number"
          />
        ) : (
          <View>
            <Input
              labelColor={colors.gray}
              onChangeText={setFirstName}
              value={firstName}
              label="First name"
            />
            <Input
              labelColor={colors.gray}
              // value="Smith"
              onChangeText={setLastName}
              value={lastName}
              label="Last name"
            />
            <Input
              date
              mode={'date'}
              labelColor={colors.gray}
              value={dateOfBirth}
              selectedDate={text =>{ 
                console.log("====DOBBB====", text)
                setDateOfBirth(text)}}
              label="Date of birth"
              placeholder={"YY-DD-MM"}
            />
            <Input
              multiline
              labelColor={colors.gray}
              onChangeText={setDescription}
              value={description}
              label="Description"
            />
            <Input
              visible={visible}
              rightPress={() => setVisible(!visible)}
              select
              value={gender?.value || gender}
              rightIcon={images.arrowDown}
              placeholder="-Select Gender-"
              datam={genderList}
              selectedItem={val => {
                setGender(val);
                setVisible(false);
              }}
            />
            <Spacer space={hp(6)} />
          </View>
        )}
      </ScrollView>
      <Button
        disabled={enableButtonfun()}
        absolute
        loading={loading}
        onPress={!changePhoneClick ? updateProfile : updatePhoneFun}
        label={!changePhoneClick ? 'Update Profile' : 'Update Phone'}
      />
    </View>
  );
};

export default PersonalDetails;
