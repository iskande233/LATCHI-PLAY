import React from 'react';
import { View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import { colors } from '~/constants/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TvEpisodes = ({ episodeData, setSelectedEpisode, selectedEpisode, isLoaded }) => {
  if (!episodeData || episodeData.length === 0) {
    return (
      <View style={{ padding: 10 }}>
        <Text style={{ color: colors.white, fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          الحلقات
        </Text>
        <Text style={{ color: colors.gray }}>لا توجد حلقات متاحة حالياً.</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 10, paddingBottom: 10 }}>
      <Text
        style={{
          color: colors.white,
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 10,
        }}>
        الحلقات
      </Text>
      {episodeData.map((episode) => {
        const isSelected = selectedEpisode?.id === episode.id;
        const episodeTitle = episode.title || episode.name || `الحلقة ${episode.episode_number || episode.episode || 1}`;

        return (
          <TouchableOpacity
            key={episode.id}
            onPress={() => {
              setSelectedEpisode(episode);
            }}
            activeOpacity={0.8}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isSelected ? colors.darkGray : colors.black,
                borderWidth: 1,
                borderColor: isSelected ? colors.red : colors.darkGray,
                borderRadius: 10,
                padding: 10,
                marginBottom: 8,
              }}>
              {/* Episode Image */}
              <Image
                source={
                  episode?.image
                    ? { uri: episode.image }
                    : require('~/assets/logo/logo.png')
                }
                style={{
                  width: 90,
                  height: 60,
                  borderRadius: 8,
                  backgroundColor: colors.darkGray,
                }}
                resizeMode="cover"
              />

              {/* Episode Info */}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    color: colors.white,
                    fontWeight: 'bold',
                    fontSize: 15,
                    marginBottom: 3,
                  }}
                  numberOfLines={2}>
                  {episodeTitle}
                </Text>
                <Text
                  style={{
                    color: colors.gray,
                    fontSize: 12,
                  }}
                  numberOfLines={2}>
                  {episode.overview || `الحلقة ${episode.episode_number || episode.episode || 1}`}
                </Text>
              </View>

              {/* Play / Loading Indicator */}
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: isSelected ? colors.red : colors.darkGray,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {!isLoaded && isSelected ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Icon
                    name="play"
                    size={16}
                    color={colors.white}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TvEpisodes;
