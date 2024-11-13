import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import axiosInstance from '../../axiosInstance';
import { Box, Button, Grid, ImageList, ImageListItem } from '@mui/material';
import BorderWithTitle from '../../components/common/borderWithTitle';
import {
  COMPLETED,
  ON_GOING_PROCESS,
  SITE_SELECTION,
} from '../../utils/constants';
import SpinnerLoader from '../../components/spinner/spinner';

export default function PreviewDetails() {
  const [preview, setPreview] = useState([{ sample: 'sample' }]);
  const [imgAndVideo, setImgAndVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const { id, UserId, SubmissionId } = useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    getDataFromApi();
  }, []);

  const getDataFromApi = async () => {
    try {
      setLoading(true);
      let { data } = await axiosInstance.post('getRecordById', {
        id: id,
        SubmissionId: SubmissionId,
      });
      let response = await axiosInstance.post('fetchImagAndVideo', {
        SubmissionId: SubmissionId,
        UserId: UserId,
      });
      if (data.code !== 200) return setLoading(false);
      setPreview(data.data);
      setImgAndVideos(response?.data.data);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }; // fetch data from api - getRecordById and fetchImagAndVideo

  // const handleBack = (obj) => {
  //   navigate(-1);
  // };

  const images = imgAndVideo.filter(
    (record: any) => record?.Url?.includes('getImage') == true,
  );
  const imagesSSiteSelection = imgAndVideo.filter(
    (record: any) => record?.StatusOfWork == SITE_SELECTION,
  );
  const imagesSOnGoing = imgAndVideo.filter(
    (record: any) => record?.StatusOfWork == ON_GOING_PROCESS,
  );
  const imagesSCompleted = imgAndVideo.filter(
    (record: any) => record?.StatusOfWork == COMPLETED,
  );
  return (
    <Box sx={{ padding: 2 }}>
      <SpinnerLoader isLoading={loading} />
      <Button
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <BorderWithTitle title={'Application Preview'}>
        <Grid container spacing={2} sx={{ display: 'flex', padding: 1 }}>
          {Object.entries(preview[0]).map(([key, value], index) => (
            <Grid
              key={index}
              item
              xs={6}
              sm={6}
              sx={{ display: 'flex', flexDirection: 'row' }}
            >
              <Grid
                xs={6}
                sm={6}
                style={{
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                }}
              >
                {key}
              </Grid>
              :
              <Grid xs={6} sm={6}>
                {!value ? 'N/A' : value.toString()}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </BorderWithTitle>
      <BorderWithTitle title={'Application Images'}>
        <Grid container spacing={2} sx={{ display: 'flex', padding: 1 }}>
          {images.length == 0 && (
            <Grid xs={12} sm={12} style={{ textAlign: 'center' }}>
              *** Images is not there for this application ***
            </Grid>
          )}
          <Grid xs={6} sm={6}>
            {imagesSSiteSelection?.length !== 0 && (
              <>
                <h4>Site Selection Images</h4>
                <ImageList
                  sx={{ width: 500, height: 450 }}
                  cols={3}
                  rowHeight={164}
                >
                  {imagesSSiteSelection?.map((item: any) => (
                    <ImageListItem key={item.id}>
                      <img
                        srcSet={`${item.Url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.Url}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.title}
                        loading="lazy"
                      />
                      <span>Longitude: {item.Longitude}</span>
                      <p>Latitude: {item.Latitude}</p>
                    </ImageListItem>
                  ))}
                </ImageList>
              </>
            )}
          </Grid>
          <Grid xs={6} sm={6}>
            {imagesSOnGoing?.length !== 0 && (
              <>
                <h4>On Going Activity Images</h4>
                <ImageList
                  sx={{ width: 500, height: 450 }}
                  cols={3}
                  rowHeight={164}
                >
                  {imagesSOnGoing?.map((item: any) => (
                    <ImageListItem key={item.id}>
                      <img
                        srcSet={`${item.Url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.Url}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.title}
                        loading="lazy"
                      />
                      <span>Longitude: {item.Longitude}</span>
                      <p>Latitude: {item.Latitude}</p>
                    </ImageListItem>
                  ))}
                </ImageList>
              </>
            )}
          </Grid>
          <Grid xs={6} sm={6}>
            {imagesSCompleted?.length !== 0 && (
              <>
                <h4>Completed Images</h4>
                <ImageList
                  sx={{ width: 500, height: 450 }}
                  cols={3}
                  rowHeight={164}
                >
                  {imagesSCompleted?.map((item: any) => (
                    <ImageListItem key={item.id}>
                      <img
                        srcSet={`${item.Url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.Url}?w=164&h=164&fit=crop&auto=format`}
                        alt={item.title}
                        loading="lazy"
                      />
                      <span>Longitude: {item.Longitude}</span>
                      <p>Latitude: {item.Latitude}</p>
                    </ImageListItem>
                  ))}
                </ImageList>
              </>
            )}
          </Grid>
        </Grid>
      </BorderWithTitle>
    </Box>
  );
}
