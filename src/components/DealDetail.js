import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Text, Image, Linking, StyleSheet, Button, TouchableOpacity, PanResponder, Animated, Dimensions } from 'react-native';

import { priceDisplay } from './util';
import ajax from '../ajax';

class DealDetail extends React.Component {
    imageXPos = new Animated.Value(0);
    imagePanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (evt, gs) => {
            this.imageXPos.setValue(gs.dx);
        },
        onPanResponderRelease: (evt, gs) => {
             this.width = Dimensions.get('window').width;
            if (Math.abs(gs.dx)> this.width * 0.4) {
                const direction = Math.sign(gs.dx);
                // -1 for left, 1 for right
                Animated.timing(this.imageXPos, {
                    toValue: direction * this.width,
                    duration: 250,
                }).start(() => this.handleSwipe(-1 * direction));
            } else {
                Animated.spring(this.imageXPos, {
                    toValue: 0,
                }).start();
            }
        },
    });
    handleSwipe = (indexDirection) => {
        if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
            Animated.spring(this.imageXPos, {
                toValue: 0,
            }).start();
            return;
        }
        this.setState((prevState) => ({
            imageIndex: prevState.imageIndex + indexDirection
        }), () => {
            // Next image animation
            this.imageXPos.setValue(indexDirection * this.width);
            Animated.spring(this.imageXPos, {
                toValue: 0,
            }).start();
        });
    }

    static propTypes = {
        initialDealData: PropTypes.object.isRequired,
        onBack: PropTypes.func.isRequired,
    };
    state = {
        deal: this.props.initialDealData,
        imageIndex: 0,
    };
    async componentDidMount() {
       const fullDeal =  await ajax.fetchDealDetail(this.state.deal.key);
       this.setState({ 
           deal: fullDeal,
        });
    }
    openDealUrl = () => {
        Linking.openURL(this.state.deal.url);
    }
  render() {
      const { deal } = this.state;
    return (
        <ScrollView style={styles.deal} >
            <TouchableOpacity onPress={this.props.onBack} >
                <Text style={styles.backLink} >Back</Text>
            </TouchableOpacity>
                <Image 
                    {...this.imagePanResponder.panHandlers}
                    source={{ uri: deal.media[this.state.imageIndex] }} 
                    style={[{ left: this.imageXPos }, styles.image]}
                />
                <View style={styles.detail} >
                    <Text style={styles.title} >{deal.title}</Text>
                    <View style={styles.footer} >
                        <Text style={styles.cause} >{priceDisplay(deal.price)}</Text>
                        <Text style={styles.price} >{deal.cause.name}</Text>
                    </View>
                </View>
                { deal.user && (            
                    <View>
                    <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
                    <Text>{deal.user.name}</Text>
                    </View>
                )}
                <View>
                <View style={styles.description} >
                    <Text>{deal.description}</Text>
                </View>
                <Button title="Buy this deal!" onPress={this.openDealUrl} />
                </View>
        </ScrollView>
    )
  }
};

const styles = StyleSheet.create({
    backLink:{
        marginBottom: 10,
        color: '#0645ad',
        marginLeft: 10,
    },
    image: {
        width: '100%',
        height: 150,
        backgroundColor: '#ccc',
    },
    deal: {
        marginBottom: 20,
    },
    detail: {
        padding: 10,
        backgroundColor: '#fff',
        borderColor: '#bbb',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        padding: 10,
        backgroundColor: 'rgb(237, 149, 45, 0.4)',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
    },
    cause: {
        flex: 2,
    },
    price: {

    },
    avatar:{
        width: 6,
        height: 60,
    },
});

export default DealDetail;
