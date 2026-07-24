import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { colors, sizes } from '~/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TvDetails = ({ setSelectedSeason, seasonData, selectedSeason }) => {
  if (!seasonData || seasonData.length === 0) {
    return (
      <View style={{ padding: 10 }}>
        <Text style={{ color: colors.white, fontSize: 16 }}>جاري تحميل المواسم...</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <Text
        style={{
          color: colors.white,
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
        }}>
        المواسم
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 5 }}>
        {seasonData.map((season) => (
          <TouchableOpacity
            key={season.id || season.season_number || season.season}
            onPress={() => {
              setSelectedSeason(season);
            }}
            activeOpacity={0.7}>
            <View
              style={{
                backgroundColor:
                  selectedSeason?.id === season.id ? colors.red : colors.darkGray,
                borderColor: colors.white,
                borderWidth: 1,
                borderRadius: 10,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginRight: 8,
                minWidth: 100,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}>
                {season.title || season.name || `موسم ${season.season_number || season.season || 1}`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default TvDetails;
