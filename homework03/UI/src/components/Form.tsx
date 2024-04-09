import { useRef, useState } from "react";

function Form () {
    const [image, setImage] = useState<string | null>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const imageRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setImage(URL.createObjectURL(img));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        const nameValue = nameRef.current?.value;
        const descriptionValue = descriptionRef.current?.value;
        const imageValue = imageRef.current?.value;

        if (!nameValue || !descriptionValue || !imageValue) {
            alert('Toate câmpurile trebuie completate!');
            // aici trebuie trimis post catre server eventual facut reflresh/redirect la profil
            return; 
        }
        console.log('Form submitted')
    };

    return (
        <>
        <form className="add-image-form" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="Name" className="form-label">
                        Name
                    </label>
                    <input type="text" className="form-control" id="Name" ref={nameRef} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Description" className="form-label">
                        Description
                    </label>
                    <input type="text" className="form-control" id="Description" ref={descriptionRef} />
                </div>
                <div className="mb-3">
                    <label htmlFor="Image" className="form-label">
                        Image
                    </label>
                    <input type="file" className="form-control" id="Image" onChange={handleImageChange} ref={imageRef} />
                </div>
                {image && (
                    <div className="mb-3">
                        <img src={image} alt="Preview" style={{ width: '40%' }} />
                    </div>
                )}
                <button type="submit" className="btn btn-primary button-submit">Submit</button>
            </form>
        </>
    )
}

export default Form;