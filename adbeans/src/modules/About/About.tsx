import { Box, Typography } from '@mui/material';

import Animal1 from '../../assets/animal1.jpeg';
import Animal2 from '../../assets/animal2.jpeg';
import Animal3 from '../../assets/animal3.jpeg';

const About = () => (
  <Box>
    <Typography
      variant="h3"
      sx={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      Zoo Animals
    </Typography>
    <Typography
      variant="h5"
      sx={{
        mt: '16px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      Exploring the world of animals has never been easier and more random
    </Typography>
    <Typography
      variant="body1"
      sx={{
        padding: '16px',
        width: '100%',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
      Atque ratione, fuga reprehenderit
      facilis animi dolorum, iusto at
      officiis nulla id dolor sunt culpa nihil? Veritatis nisi mollitia unde qui ducimus?
      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      Unde ipsam, ratione voluptatem porro sapiente id adipisci
      incidunt cupiditate asperiores explicabo qui.
      Incidunt unde nam porro nostrum praesentium eveniet molestiae quos!
      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Facere at dicta placeat porro aut expedita cumque deleniti harum.
      Cum, eaque? Blanditiis illum numquam expedita officiis ratione. Impedit illum nemo rerum.
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Sed, deserunt nulla libero obcaecati blanditiis nesciunt impedit,
      veritatis tempore iure maxime quod consequuntur quis expedita repellat,
      amet dolorem officiis ipsum corrupti.
    </Typography>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: { xs: 'column', md: 'row' },
        padding: '32px',
      }}
    >
      <Box
        component="img"
        src={Animal1}
        sx={{
          mb: { xs: '32px', md: '0px' },
          mr: { xs: '0px', md: '32px' },
          width: '100%',
          maxWidth: '300px',
          height: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.75)',
        }}
      />
      <Box
        component="img"
        src={Animal2}
        sx={{
          mb: { xs: '32px', md: '0px' },
          mr: { xs: '0px', md: '32px' },
          width: '100%',
          maxWidth: '300px',
          height: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.75)',
        }}
      />
      <Box
        component="img"
        src={Animal3}
        sx={{
          width: '100%',
          maxWidth: '300px',
          height: '300px',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.75)',
        }}
      />
    </Box>
    <Typography
      variant="body1"
      sx={{
        padding: '16px',
        width: '75%',
        mx: 'auto',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
      Placeat necessitatibus optio eaque, quaerat quisquam ab asperiores nisi!
      Adipisci amet labore officia ad eligendi voluptatem quis iste ab. Voluptatem, ducimus quo?
      Lorem ipsum, dolor sit amet consectetur adipisicing elit.
      Distinctio expedita nesciunt aperiam facere quibusdam vel
      cum maiores nihil dolores corrupti repudiandae ducimus eum
      praesentium unde autem, voluptates necessitatibus odio magni!
    </Typography>
    <Typography
      variant="body1"
      sx={{
        padding: '16px',
        width: '75%',
        mx: 'auto',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      Thanks to <a target="_blank" href="https://zoo-animal-api.herokuapp.com/" rel="noreferrer">Zoo Animal API</a> for the images all the info.
    </Typography>
    <Typography
      variant="body1"
      sx={{
        padding: '16px',
        width: '75%',
        mx: 'auto',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      The app was build by <a target="_blank" href="https://github.com/NikaTheEngineer" rel="noreferrer">Nikoloz Pestvenidze</a>, a great guy and a full-stack developer.
    </Typography>
  </Box>
);

export default About;
