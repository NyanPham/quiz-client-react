import { Grid2 } from '@mui/material'

const Center = ({ children }) => {
    return (
        <Grid2
            container
            direction="column"
            alignItems={'center'}
            justifyContent={'center'}
            sx={{ minHeight: '100vh' }}
        >
            <Grid2 xs={1}>{children}</Grid2>
        </Grid2>
    )
}

export default Center
