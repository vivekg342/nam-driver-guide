import React from 'react'
import { connect } from 'react-redux'
import { View, Image, Text, ActivityIndicator, ListView } from 'react-native'
import Button from 'react-native-button'
import MapView from 'react-native-maps'
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/Ionicons'
import { bindActionCreators } from 'redux'
import actions from '../../actions'
import styles from './dashboard.styles'

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

class LoginContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      region: null,
    }

    this.visitedDataSource = ds.cloneWithRows([])
  }
  onPressGotoCurrentPositionButton = () => {
    this.setState({
      region: this.props.currentLocation,
    })
    setTimeout(() => {
      this.setState({
        region: null,
      })
    }, 1000)
  }

  render() {
    const { currentLocation, router, nextStop, visitedStop } = this.props

    if (!currentLocation)
      return (
        <View style={styles.container}>
          <ActivityIndicator style={styles.spiner} color={'red'} />
        </View>
      )

    this.visitedDataSource = ds.cloneWithRows(visitedStop)

    return (
      <View style={styles.container}>
        <MapView
          region={this.state.region}
          style={styles.mapView}
          initialRegion={currentLocation}
        >
          {router &&
            <MapView.Polyline
              coordinates={router}
              strokeWidth={5}
              strokeColor="blue"
            />}

          {currentLocation &&
            <MapView.Marker coordinate={currentLocation}>
              <Icon name="md-bicycle" size={30} color="red" />
            </MapView.Marker>}
        </MapView>
        <Button
          onPress={this.onPressGotoCurrentPositionButton}
          containerStyle={styles.currentPosButton}
        >
          <Icon
            name="ios-locate"
            size={23}
            style={styles.currentPosButtonIcon}
            color="red"
          />
        </Button>
        <View>
          <View style={styles.hiddenVisitedDoneList}>
            <ListView
              dataSource={this.visitedDataSource}
              renderRow={rowData =>
                <View style={styles.visitedDoneRow}>
                  <Icon name="ios-done-all" size={60} color="green" />
                  <Text style={styles.visitedDoneRowText}>
                    {rowData.address}
                  </Text>
                </View>}
            />
          </View>
          <Button containerStyle={styles.nextStop}>
            <Image
              style={styles.stopIcon}
              source={require('../../assets/deliveryPlace.png')}
            />
            <Text>
              {nextStop.address}
            </Text>
          </Button>
        </View>
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  act: bindActionCreators(actions, dispatch),
})

const mapStateToProps = state => {
  const currentLocation = state.location.currentLocation
  const router = state.location.router
  const nextStop = state.delivery.nextStop
  const visitedStop = state.delivery.visitedStop
  return {
    currentLocation,
    router,
    nextStop,
    visitedStop,
  }
}

LoginContainer.propTypes = {
  currentLocation: React.PropTypes.object,
  router: React.PropTypes.array,
  visitedStop: React.PropTypes.array,
  nextStop: React.PropTypes.object,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
