import {Box, Button, Text, TextField, Image} from '@skynexui/components'
import { urlObjectKeys } from 'next/dist/shared/lib/utils';
import React, { useState } from 'react';
import { useRouter} from 'next/router';
import appConfig from '../config.json'




function Title(props) {
    console.log(props);
    const Tag = props.tag;
    return (
    <>
        <Tag>{props.children}</Tag> 
        <style jsx>{`
      ${Tag} {
        color: ${appConfig.theme.colors.neutrals['900']};
        font-size: 24px;
        font-weight: 600;
      }
    `}</style>
        </>
        )
    }


/* function HomePage() {
    return (
    <div>
        <GlobalStyle/>
        <Title tag="h2">Welcome to Nightcord.</Title>
        <h2>Local server: Empty Sekai</h2>
        
        

        
        </div>
        )
    } */
   
  
  
    export default function PaginaInicial() {
        
        const [username, setUsername] = React.useState('');
        const [userLocation, setUserLocation] = React.useState('');
        const roteamento = useRouter();
        
        React.useEffect(()=>{
          fetch(`https://api.github.com/users/${username}`).then(async (response) => {
            let userData = await response.json();
            const userLocation = userData.location;
            setUserLocation(userLocation);

          });
        })
        
        
        
      
        return (
          <>
          
            <Box
              styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: 'url(https://pbs.twimg.com/media/Ej2sGpEVgAEju96?format=jpg&name=large)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
              }}
            >
              <Box
                styleSheet={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: {
                    xs: 'column',
                    sm: 'row',
                  },
                  width: '100%', maxWidth: '700px',
                  borderRadius: '5px', padding: '32px', margin: '16px',
                  boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                }}
              >
                {/* Formulário */}
                <Box
                  as="form"
                  onSubmit={function (infosDoEvento){
                    infosDoEvento.preventDefault();

                    console.log('Submission.');
                    roteamento.push(`/chat?username=${username}`);

                    
                  }}
                  styleSheet={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                  }}
                >
                  <Title tag="h2">Nightcord</Title>
                  <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                    {appConfig.name}
                  </Text>
                  {/* <input type="text" value={username} onChange={function (event){
                    console.log("User typed.", event.target.value); //Onde ta o valor
                    const valor = event.target.value; // Troca o valor
                    setUsername(valor);

                  }}/>*/}
      
                {  <TextField
                value={username} onChange={function (event){
                  console.log("User typed.", event.target.value); //Onde ta o valor
                  const valor = event.target.value; // Troca o valor
                  setUsername(valor);

                }}
                    fullWidth
                    textFieldColors={{
                      neutral: {
                        textColor: appConfig.theme.colors.neutrals[200],
                        mainColor: appConfig.theme.colors.neutrals[900],
                        mainColorHighlight: appConfig.theme.colors.primary[500],
                        backgroundColor: appConfig.theme.colors.neutrals[800],
                      },
                    }}
                  />  }
                  <Button
                    type='submit'
                    label='Entrar'
                    fullWidth
                    buttonColors={{
                      contrastColor: appConfig.theme.colors.neutrals['500'],
                      mainColor: appConfig.theme.colors.primary[100],
                      mainColorLight: appConfig.theme.colors.primary[200],
                      mainColorStrong: appConfig.theme.colors.primary[200],
                    }}
                  />
                </Box>
                {/* Formulário */}
      
      
                {/* Photo Area */}
                <Box
                  styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    maxWidth: '200px',
                    padding: '16px',
                    backgroundColor: appConfig.theme.colors.neutrals[800],
                    border: '1px solid',
                    borderColor: appConfig.theme.colors.neutrals[999],
                    borderRadius: '10px',
                    flex: 1,
                    minHeight: '240px',
                  }}
                >
                  <Image
                    styleSheet={{
                      borderRadius: '50%',
                      marginBottom: '16px',
                    }}
                    src={
                  username.length > 2 
                  ? `https://github.com/${username}.png`
                  :`https://cdn-icons-png.flaticon.com/512/74/74375.png`}
                  />
                  <Text
                    variant="body4"
                    styleSheet={{
                      color: appConfig.theme.colors.neutrals[200],
                      backgroundColor: appConfig.theme.colors.neutrals[900],
                      padding: '3px 10px',
                      borderRadius: '1000px'
                    }}
                  >
                    {username}
                  </Text>
                  <Text
              variant="body5"
              styleSheet={{
                color: appConfig.theme.colors.primary['000'],
                backgroundColor: appConfig.theme.colors.primary['200'],
                padding: "3px 10px",
                borderRadius: "1000px",
                marginTop: "10px",
              }}
            >
              {username.length > 2 
              ? userLocation 
              : "-"}
            </Text>
                </Box>
                {/* Photo Area */}
              </Box>
            </Box>
          </>
        );
      }