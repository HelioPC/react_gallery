import { FormEvent, useEffect, useState } from 'react';
import { PhotoItem } from './components/PhotoItem';
import * as Photos from './services/photos';
import * as C from './styles';
import { Photo } from './types/Photo';

function App() {
	const [upload, setUpload] = useState(false);
	const [load, setLoad] = useState(false);
	const [photos, setPhotos] = useState<Photo[]>([]);

	useEffect(() => {
		const getPhotos = async () => {
			setLoad(true);
			setPhotos(await Photos.getAll());
			setLoad(false);
		}

		getPhotos();
	}, []);

	const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const file = formData.get('image') as File;

		if(file && file.size > 0) {
			setUpload(true);
			let result = await Photos.insert(file);
			setUpload(false);

			if(result instanceof Error) {
				alert(`${result.name} - ${result.message}`);
			}else {
				let newPhotoList = [...photos];
				newPhotoList.push(result);
				setPhotos(newPhotoList);
			}
		}
	}

	return (
		<C.Container>
			<C.Area>
				<C.Header>Galeria de Fotos</C.Header>

				<C.UploadForm onSubmit={handleFormSubmit} method='POST' >
					<input type='file' name='image' />
					<input type='submit' value='Enviar' />
					{upload && 'Enviando...'}
				</C.UploadForm>

				{load &&
					<C.ScreenWarning>
						<div className='emoji'>✋🏽</div>
						<div>Carregando...</div>
					</C.ScreenWarning>
				}

				{!load && photos.length > 0 &&
					<C.PhotoList>
						{photos.map((item, index) => (
							<PhotoItem key={index} url={item.url} name={item.name} ></PhotoItem>
						))}
					</C.PhotoList>
				}

				{!load && photos.length === 0 &&
					<C.ScreenWarning>
						<div className='emoji'>😔</div>
						<div>Sem Fotos na Galeria</div>
					</C.ScreenWarning>
				}
			</C.Area>
		</C.Container>
	);
}

export default App;
