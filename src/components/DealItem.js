import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, StyleSheet } from 'react-native';

import { priceDisplay } from '../components/util';

class DealItem extends React.Component {
    static propTypes = {
        deal: PropTypes.object.isRequired,
        onPress: PropTypes.func.isRequired,
    };
    handlePress = () => {
        this.props.onPress(this.props.deal.key);
    };
  render() {
      const { deal } = this.props;
    return (
        <View style={styles.deal} >
            <Image 
                source={{ uri: deal.media[0] }}
                style={styles.image}    
            />
            <View style={styles.info} >
                <Text style={styles.title} >{deal.title}</Text>
                <View style={styles.footer} >
                    <Text style={styles.case} >{priceDisplay(deal.price)}</Text>
                    <Text style={styles.price} >{deal.cause.name}</Text>
                </View>
            </View>
        </View>
    )
  }
};

const styles = StyleSheet.create({
    deal: {
        marginHorizontal: 12,
        marginTop: 12,
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc',
    },
    info: {
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#bbb',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    footer: {
        flexDirection: 'row',
    },
    cause: {
        flex: 2,
    },
    price: {

    },
});

export default DealItem;
