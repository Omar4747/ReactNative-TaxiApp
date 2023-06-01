import { StyleSheet } from "react-native";
import { colors } from "../../../res/colors";
import { wp } from "../../../res/constants";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    subView: {
        paddingHorizontal: wp(4)
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: wp(4)
    },
    divier: {
        backgroundColor: colors.gray6,
        padding: wp(1.6),
        marginVertical: wp(2),
    }

})