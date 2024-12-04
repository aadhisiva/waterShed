import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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

  const { id, UserId, SubmissionId, ActivityId, SubActivityId } =
    useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    getDataFromApi();
  }, []);

  const getDataFromApi = async () => {
    try {
      setLoading(true);
      const isSub = !SubActivityId || SubActivityId == '';
      let { data } = await axiosInstance.post('getRecordById', {
        id: id,
        SubmissionId: SubmissionId,
        ActivityType: isSub ? 'No' : 'Yes',
        ActivityId: isSub ? ActivityId : SubActivityId,
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

  // console.log("images[0]['Url']",images[0]?.['Url'])

  const downloadPdf = async () => {
    const doc: any = new jsPDF();
    let yPosition = 10; // Initial Y position

    // Title
    doc.setFontSize(18);
    doc.text('Watershed Application', 10, yPosition);
    yPosition += 10;

    // Prepare data for vertical table
    const rows = Object.entries(preview[0]).map(([key, value]) => {
      if (Array.isArray(value)) {
        // If the value is an array, format it as a string
        value = value.map((item) => JSON.stringify(item)).join('\n');
      }
      return [key, value ?? 'N/A'];
    });

    // Create vertical table
    doc.autoTable({
      head: [['Field', 'Value']], // Table header
      body: rows, // Key-value pairs
      startY: 20, // Starting Y position
      margin: { top: 20, left: 10, right: 10 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    yPosition = doc.previousAutoTable.finalY + 10;
    // Add images with names
    for (const image of images) {
      doc.text(image?.['StatusOfWork'], 10, yPosition); // Add image name
      doc.setFontSize(10);
      yPosition += 10;
      doc.text('Longitude :' + image?.['Longitude'], 10, yPosition); // Add image name
      yPosition += 10;
      doc.text('Latitude :' + image?.['Latitude'], 10, yPosition); // Add image name
      const img = await loadImage(image?.['Url']); // Load the image as Base64
      doc.addImage(img, 'JPEG', 10, yPosition + 5, 50, 50); // Add the image (adjust size as needed)
      yPosition += 60; // Adjust for next image
    }

    // Save PDF
    doc.save(`${SubmissionId}.pdf`);
  };
  // Helper function to load images as Base64
  const loadImage = (url: string) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx: any = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <SpinnerLoader isLoading={loading} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          // startIcon={<ArrowBackIcon />}
          onClick={downloadPdf}
        >
          Download
        </Button>
      </Box>
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
