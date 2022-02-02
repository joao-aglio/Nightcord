import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticket';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU2OTEzNCwiZXhwIjoxOTU5MTQ1MTM0fQ.dsw8a0xkMaxQGMJd1iGq9EQLlJnjjv654Hd8FF5dMb8';
const SUPABASE_URL = 'https://cfzigceygemwkpbbuneu.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function pegaMensagens(adicionaMensagem){
  return supabaseClient.from("mensagens").on("INSERT", (respostaLive)=>{
    adicionaMensagem(respostaLive.new);
  }).subscribe();
}

export default function ChatPage() {
    const roteamento = useRouter();
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const usuarioLogado = roteamento.query.username;
    
  
    React.useEffect(() => {
      supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', { ascending: false})
        .then(({data}) => {
          
          setListaDeMensagens(data);
        });
  
        const subscription = pegaMensagens((novaMensagem) => {
          setListaDeMensagens((valorAtualDaLista) => {
            return [
              novaMensagem,
              ...valorAtualDaLista,
            ]
          });
        });
    
        return () => {
          subscription.unsubscribe();
        }
      }, []);
  
    function handleNovaMensagem(novaMensagem) {
      console.log( 'handleNovaMensagem', novaMensagem )
      const mensagem = {
        usuario: usuarioLogado,
        mensagem: novaMensagem,
      };
  
      supabaseClient.from('mensagens').insert([mensagem]).then(({ data }) => {
          
        console.log('Criando mensagem: ', data);
        });
  
      setMensagem("");
    }
  
    return (
      <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.primary[500],
          backgroundImage: 'url(https://pbs.twimg.com/media/Ej2sGpEVgAEju96?format=jpg&name=large)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
          color: appConfig.theme.colors.neutrals['000']
        }}
      >
        <Box
          styleSheet={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
            borderRadius: '5px',
            backgroundColor: appConfig.theme.colors.neutrals[700],
            height: '100%',
            maxWidth: '95%',
            maxHeight: '95vh',
            padding: '32px',
          }}
        >
          <Header />
          <Box
            styleSheet={{
              position: 'relative',
              display: 'flex',
              flex: 1,
              height: '80%',
              backgroundColor: appConfig.theme.colors.neutrals[600],
              flexDirection: 'column',
              borderRadius: '5px',
              padding: '16px',
            }}
          >
            <MessageList mensagens={listaDeMensagens} />
            
            <Box
              as="form"
              styleSheet={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TextField
                value={mensagem}
                onChange={(event) => {
                  const valor = event.target.value;
                  setMensagem(valor);
                }}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleNovaMensagem(mensagem);
                  }
                }}
                placeholder="Insira sua mensagem aqui..."
                type="textarea"
                styleSheet={{
                  width: '100%',
                  border: '0',
                  resize: 'none',
                  borderRadius: '5px',
                  padding: '6px 8px',
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                  marginRight: '12px',
                  color: appConfig.theme.colors.neutrals[200],
                }}
              />
              <ButtonSendSticker
              onStickerClick ={(sticker)=>{
                handleNovaMensagem(':sticker: ' + sticker)

              }}/>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
  
  function Header() {
    return (
      <>
        <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
          <Text variant='heading5'>
            Chat
          </Text>
          <Button
            variant='tertiary'
            colorVariant='neutral'
            label='Logout'
            href="/"
          />
        </Box>
      </>
    )
  }
  
  function MessageList(props) {
    
    return (
      <Box
        tag="ul"
        styleSheet={{
          overflow: 'scroll',
          display: 'flex',
          flexDirection: 'column-reverse',
          flex: 1,
          color: appConfig.theme.colors.neutrals["000"],
          marginBottom: '16px',
        }}
      >
        {props.mensagens.map((mensagem) => {
          return (
            <Text
              key={mensagem.id}
              tag="li"
              styleSheet={{
                borderRadius: '5px',
                padding: '6px',
                marginBottom: '12px',
                hover: {
                  backgroundColor: appConfig.theme.colors.neutrals[700],
                }
              }}
            >
              <Box
                styleSheet={{
                  marginBottom: '8px',
                }}
              >
                <Image
                  styleSheet={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'inline-block',
                    marginRight: '8px',
                  }}
                  src={`https://github.com/${mensagem.usuario}.png`}
                />
                <Text tag="strong">
                  {mensagem.usuario}
                </Text>
                <Text
                  styleSheet={{
                    fontSize: '10px',
                    marginLeft: '8px',
                    color: appConfig.theme.colors.neutrals[300],
                  }}
                  tag="span"
                >
                  {(new Date().toLocaleDateString())}
                  
                </Text>
              </Box>
              {mensagem.mensagem.startsWith(':sticker:')
              ? (
                <Image src={mensagem.mensagem.replace(':sticker:', '')} />
              )
              : (
                mensagem.mensagem
              )}
              
            </Text>
          )
        })}
      </Box>
    )
  }
 
  