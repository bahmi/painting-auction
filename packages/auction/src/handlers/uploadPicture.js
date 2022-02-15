export async function uploadPicture() {
  return {
    statusCode: 200,
    body: JSON.stringify({}),
  };
}

export const handler = uploadPicture;
