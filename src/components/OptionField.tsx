import { Box, Button, TextField } from '@mui/material'
import DeleteOutline from '@mui/icons-material/DeleteOutline'

type OptionFieldProps = {
    idx: number
    optionValue: string
    handleOptionChange: (idx: number, value: string) => void
    handleDeleteOption: (idx: number) => void
    showDeleteButton: boolean
    error: string
}

const OptionField = ({
    idx,
    optionValue,
    handleOptionChange,
    handleDeleteOption,
    showDeleteButton,
    error,
}: OptionFieldProps) => {
    return (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id={`option${idx + 1}`}
                label={`Option ${idx + 1}`}
                name={`option${idx + 1}`}
                autoComplete={`option${idx + 1}`}
                value={optionValue}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                error={!!error}
                helperText={error}
            />
            {showDeleteButton && (
                <Button
                    type="button"
                    onClick={() => handleDeleteOption(idx)}
                    variant="contained"
                    color="error"
                    sx={{
                        ml: 1,
                        px: 1,
                        maxWidth: 'max-content',
                        minWidth: 'max-content',
                        '& .MuiButton-icon': { margin: 0 },
                    }}
                    startIcon={<DeleteOutline />}
                />
            )}
        </Box>
    )
}

export default OptionField
