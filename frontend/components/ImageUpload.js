import { useState } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const changeHandler = async e => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "seoblog");
    setLoading(true);
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/seoblog/image/upload",
      {
        method: "POST",
        body: data
      }
    );
    const image = await res.json();
    setImage(image.secure_url);
    setLoading(false);
  };

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-12'>
          <form>
            <div className='form-group'>
              <input
                className='form-control'
                onChange={changeHandler}
                type='file'
                name='file'
                placeholder='Upload a profile picture'
              />
            </div>
          </form>
          <div className='container-fluid'>
            {loading ? (
              <div className='spinner-border text-primary' role='status'>
                <span className='sr-only'>Loading...</span>
              </div>
            ) : (
              <img src={image}></img>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
