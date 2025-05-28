// src/lib/video/clientConfig.ts
export const videoConfig = {
  hlsConfig: {
    enableWorker: true,
    lowLatencyMode: true,
    backBufferLength: 90,
    maxBufferLength: 30,
    maxMaxBufferLength: 60,
    maxBufferSize: 200 * 1000 * 1000, // 200MB
  },
  
  dashConfig: {
    streaming: {
      lowLatencyEnabled: true,
      abr: {
        useDefaultABRRules: true,
        ABRStrategy: 'abrDynamic',
        bandwidthSafetyFactor: 0.9,
      },
      buffer: {
        bufferTimeAtTopQuality: 30,
        bufferToKeep: 60,
        stableBufferTime: 20,
      },
    },
  },
  
  shakaConfig: {
    streaming: {
      bufferingGoal: 60,
      rebufferingGoal: 2,
      bufferBehind: 30,
      smallGapLimit: 1.5,
      jumpLargeGaps: true,
    },
    abr: {
      enabled: true,
      defaultBandwidthEstimate: 1000000, // 1Mbps
    },
  },
  
  analyticsConfig: {
    videoEventsToTrack: [
      'play', 'pause', 'ended', 'timeupdate', 'volumechange', 
      'seeking', 'seeked', 'ratechange', 'enterfullscreen', 
      'exitfullscreen', 'qualitychange', 'error'
    ],
    mux: {
      dataCollectionDomain: 'mux.com',
      includePercentComplete: true,
    }
  },
};