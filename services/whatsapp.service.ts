type SendWhatsappPayload = {
  phone: string;

  message: string;
};

export const sendWhatsappService =
  async ({
    phone,
    message,
  }: SendWhatsappPayload) => {

    const response =
      await fetch(
        'https://mwxeimiyirzgaqixguef.supabase.co/functions/v1/send-whatsapp',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            phone,
            message,
          }),
        }
      );

    console.log(
      'Status:',
      response.status
    );

    const data =
      await response.json();

    console.log(
      'Response:',
      data
    );

    return data;
  };