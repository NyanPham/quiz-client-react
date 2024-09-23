import { Grid2 } from '@mui/material'
import { ReactNode } from 'react'

type CenterProps = {
    children: ReactNode
}

const Center = ({ children }: CenterProps) => {
    return (
        <Grid2
            container
            direction="column"
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ minHeight: '100vh' }}
        >
            <Grid2 component="div">{children}</Grid2>
        </Grid2>
    )
}

export default Center
