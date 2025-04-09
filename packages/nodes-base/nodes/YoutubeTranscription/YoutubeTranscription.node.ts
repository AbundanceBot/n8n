import {
    IExecuteFunctions,
  } from 'n8n-workflow';
  
  import {
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
  } from 'n8n-workflow';
  
  import { getTranscript } from 'youtube-transcript';
  
  export class YoutubeTranscription implements INodeType {
    description: INodeTypeDescription = {
      displayName: 'YouTube Transcription',
      name: 'youtubeTranscription',
      icon: 'file:youtube.svg',
      group: ['transform'],
      version: 1,
      description: 'Get transcript from YouTube video',
      defaults: {
        name: 'YouTube Transcription',
      },
      inputs: ['main'],
      outputs: ['main'],
      properties: [
        {
          displayName: 'Video ID',
          name: 'videoId',
          type: 'string',
          default: '',
          placeholder: 'e.g. n2RNcPRtAiY',
          description: 'YouTube video ID to fetch transcript for',
          required: true,
        },
      ],
    };
  
    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
      const items = this.getInputData();
  
      const returnData: INodeExecutionData[] = [];
  
      for (let i = 0; i < items.length; i++) {
        const videoId = this.getNodeParameter('videoId', i) as string;
  
        try {
          const transcript = await getTranscript(videoId);
          const transcriptText = transcript.map(t => t.text).join(' ');
  
          returnData.push({
            json: {
              videoId,
              transcript: transcriptText,
            },
          });
        } catch (error) {
          returnData.push({
            json: {
              videoId,
              error: error.message,
            },
          });
        }
      }
  
      return [returnData];
    }
  }