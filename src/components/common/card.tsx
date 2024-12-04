import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
interface SchmesProps {
  id: number, 
  name: string;
  logo: string;
  count: number;
}
interface CardFormateProps {
  obj: SchmesProps,
  onClick?: (obj: any) => void,
  color?: string;
}

export default function CardFormate({obj, onClick, color}: CardFormateProps)  {
  return (
    <Card
      sx={{
        minWidth: 225,
        minHeight: 150,
        justifyContent: 'center',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        border: `2px solid ${color}`
      }}
      onClick={(e) => onClick && onClick(obj)}
    >
      <CardContent>
        {/* <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          Word of the Day
        </Typography> */}
        {obj?.logo && 
         <img
            srcSet={obj?.logo}
            src={obj?.logo}
            alt={"watershed"}
            loading="lazy"
            width={100}
            height={100}
          />
        }
        <Typography variant="h5" component="div">
          {obj.name}
        </Typography>
        {/* <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography> */}
        <Typography variant="body2" sx={{textAlign: 'center', marginTop: 2, color: color}}>{obj.count}</Typography>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}
