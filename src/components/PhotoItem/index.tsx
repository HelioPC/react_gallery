import * as C from './style';

type Props = {
    url: string;
    name: string;
}

export const PhotoItem = ({ url, name }: Props) => {
    return(
        <C.Container>
            <img src={url} alt={name} />
            {name}
        </C.Container>
    )
}
