import { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
    Snackbar,
    Alert,
    Chip,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    Card,
    CardContent,
    InputAdornment,
    Tabs,
    Tab,
} from '@mui/material'
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    Search as SearchIcon,
    Policy as PolicyIcon,
    Event as EventIcon,
    AttachMoney as MoneyIcon,
    Agriculture as AgricultureIcon,
} from '@mui/icons-material'
import axios from 'axios'

const SchemeManagement = () => {
    const [schemes, setSchemes] = useState([])
    const [loading, setLoading] = useState(true)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [openViewDialog, setOpenViewDialog] = useState(false)
    const [selectedScheme, setSelectedScheme] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('')
    const [filterStatus, setFilterStatus] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    })

    const categories = [
        { value: 'insurance', label: 'Insurance' },
        { value: 'financial-assistance', label: 'Financial Assistance' },
        { value: 'credit', label: 'Credit' },
        { value: 'technical-assistance', label: 'Technical Assistance' },
        { value: 'infrastructure', label: 'Infrastructure' },
        { value: 'sustainable-farming', label: 'Sustainable Farming' },
        { value: 'marketing', label: 'Marketing' },
        { value: 'production', label: 'Production' },
        { value: 'development', label: 'Development' },
        { value: 'renewable-energy', label: 'Renewable Energy' },
        { value: 'other', label: 'Other' },
    ]

    const [newScheme, setNewScheme] = useState({
        title: '',
        description: '',
        category: 'financial-assistance',
        eligibility: '',
        benefits: '',
        applicationProcess: '',
        documents: '',
        lastDateToApply: '',
        contactPhone: '',
        contactEmail: '',
        contactWebsite: '',
        status: 'active',
        relevance: 'medium',
        additionalInfo: '',
    })
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        fetchSchemes()
    }, [])

    const fetchSchemes = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/scheme-management/schemes')
            setSchemes(response.data.schemes || [])
        } catch (err) {
            console.error('Error fetching schemes:', err)
            // Use sample data for demo
            setSchemes(getSampleSchemes())
        } finally {
            setLoading(false)
        }
    }

    const getSampleSchemes = () => [
        {
            _id: '1',
            title: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
            description: 'Income support of ₹6,000 per year to all farmer families across the country in three equal installments of ₹2,000 each.',
            category: 'financial-assistance',
            eligibility: ['All farmer families with cultivable land', 'Subject to exclusion criteria'],
            benefits: ['₹6,000 per year in 3 installments', 'Direct bank transfer', 'No interest or repayment required'],
            applicationProcess: ['Register on PM-KISAN portal', 'Submit Aadhaar and bank details', 'Land verification by local authorities'],
            documents: ['Aadhaar Card', 'Bank Account Details', 'Land Records'],
            lastDateToApply: null,
            contactDetails: { phone: '1800-11-5526', email: 'pmkisan-ict@gov.in', website: 'https://pmkisan.gov.in' },
            status: 'active',
            relevance: 'high',
            createdAt: new Date().toISOString(),
        },
        {
            _id: '2',
            title: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
            description: 'Crop insurance scheme providing financial support to farmers suffering crop loss due to natural calamities, pests, and diseases.',
            category: 'insurance',
            eligibility: ['All farmers growing notified crops', 'Both loanee and non-loanee farmers'],
            benefits: ['Low premium rates (2% for Kharif, 1.5% for Rabi)', 'Coverage for prevented sowing', 'Post-harvest losses covered'],
            applicationProcess: ['Apply through bank or CSC', 'Pay premium share', 'Automatic claim settlement'],
            documents: ['Land Records', 'Sowing Certificate', 'Bank Account Details'],
            lastDateToApply: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            contactDetails: { phone: '1800-200-7710', email: 'help.agri-insurance@gov.in', website: 'https://pmfby.gov.in' },
            status: 'active',
            relevance: 'high',
            createdAt: new Date().toISOString(),
        },
        {
            _id: '3',
            title: 'Kisan Credit Card (KCC)',
            description: 'Provides farmers with short-term credit for crop production, working capital, and allied activities at subsidized interest rates.',
            category: 'credit',
            eligibility: ['All farmers including tenant farmers', 'SHGs or Joint Liability Groups'],
            benefits: ['Credit up to ₹3 lakh at 7% interest', '3% interest subvention for timely repayment', 'Flexible repayment options'],
            applicationProcess: ['Apply at nearest bank branch', 'Submit land and identity documents', 'Credit assessment and card issuance'],
            documents: ['Land Records', 'Identity Proof', 'Passport Size Photos', 'Application Form'],
            lastDateToApply: null,
            contactDetails: { phone: '14155', email: 'help@pmkisan.gov.in', website: 'https://www.nabard.org' },
            status: 'active',
            relevance: 'high',
            createdAt: new Date().toISOString(),
        },
        {
            _id: '4',
            title: 'Soil Health Card Scheme',
            description: 'Provides soil health cards to farmers carrying crop-wise recommendations of nutrients and fertilizers.',
            category: 'technical-assistance',
            eligibility: ['All farmers owning agricultural land', 'No income or land size restrictions'],
            benefits: ['Free soil testing', 'Personalized fertilizer recommendations', 'Improved crop yield guidance'],
            applicationProcess: ['Register at local agriculture office', 'Soil sample collection', 'Receive Soil Health Card'],
            documents: ['Land Records', 'Identity Proof'],
            lastDateToApply: null,
            contactDetails: { phone: '1800-180-1551', email: 'soilhealth@gov.in', website: 'https://soilhealth.dac.gov.in' },
            status: 'active',
            relevance: 'medium',
            createdAt: new Date().toISOString(),
        },
        {
            _id: '5',
            title: 'PM Kusum (Solar Energy Scheme)',
            description: 'Promotes installation of solar pumps and grid-connected solar power plants for farmers.',
            category: 'renewable-energy',
            eligibility: ['Farmers owning irrigation pumps', 'Farmers with barren or fallow land'],
            benefits: ['60% subsidy on solar pumps', 'Additional income from solar power sale', 'Reduced electricity bills'],
            applicationProcess: ['Apply through state nodal agency', 'Site inspection and approval', 'Installation and commissioning'],
            documents: ['Land Records', 'Bank Account', 'Electricity Connection (if existing)'],
            lastDateToApply: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
            contactDetails: { phone: '1800-180-3333', email: 'kusum.mnre@gov.in', website: 'https://pmkusum.mnre.gov.in' },
            status: 'active',
            relevance: 'medium',
            createdAt: new Date().toISOString(),
        },
    ]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setNewScheme({ ...newScheme, [name]: value })
        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: '' })
        }
    }

    const handleAddScheme = async () => {
        const errors = {}
        if (!newScheme.title) errors.title = 'Title is required'
        if (!newScheme.description) errors.description = 'Description is required'
        if (!newScheme.eligibility) errors.eligibility = 'Eligibility is required'
        if (!newScheme.benefits) errors.benefits = 'Benefits are required'
        if (!newScheme.contactEmail) errors.contactEmail = 'Contact email is required'

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors)
            return
        }

        try {
            setLoading(true)
            const schemeData = {
                ...newScheme,
                eligibility: newScheme.eligibility.split('\n').filter(Boolean),
                benefits: newScheme.benefits.split('\n').filter(Boolean),
                applicationProcess: newScheme.applicationProcess.split('\n').filter(Boolean),
                documents: newScheme.documents.split('\n').filter(Boolean),
                contactDetails: {
                    phone: newScheme.contactPhone,
                    email: newScheme.contactEmail,
                    website: newScheme.contactWebsite,
                },
            }

            if (editMode && selectedScheme) {
                await axios.put(`/api/scheme-management/schemes/${selectedScheme._id}`, schemeData)
                setSnackbar({ open: true, message: 'Scheme updated successfully!', severity: 'success' })
            } else {
                await axios.post('/api/scheme-management/schemes', schemeData)
                setSnackbar({ open: true, message: 'Scheme added successfully!', severity: 'success' })
            }

            setOpenAddDialog(false)
            resetForm()
            fetchSchemes()
        } catch (err) {
            console.error('Error saving scheme:', err)
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to save scheme',
                severity: 'error',
            })
        } finally {
            setLoading(false)
        }
    }

    const handleEditScheme = (scheme) => {
        setSelectedScheme(scheme)
        setNewScheme({
            title: scheme.title,
            description: scheme.description,
            category: scheme.category,
            eligibility: Array.isArray(scheme.eligibility) ? scheme.eligibility.join('\n') : scheme.eligibility,
            benefits: Array.isArray(scheme.benefits) ? scheme.benefits.join('\n') : scheme.benefits,
            applicationProcess: Array.isArray(scheme.applicationProcess) ? scheme.applicationProcess.join('\n') : scheme.applicationProcess || '',
            documents: Array.isArray(scheme.documents) ? scheme.documents.join('\n') : scheme.documents || '',
            lastDateToApply: scheme.lastDateToApply ? new Date(scheme.lastDateToApply).toISOString().split('T')[0] : '',
            contactPhone: scheme.contactDetails?.phone || '',
            contactEmail: scheme.contactDetails?.email || '',
            contactWebsite: scheme.contactDetails?.website || '',
            status: scheme.status,
            relevance: scheme.relevance,
            additionalInfo: scheme.additionalInfo || '',
        })
        setEditMode(true)
        setOpenAddDialog(true)
    }

    const handleDeleteScheme = async (schemeId) => {
        if (!window.confirm('Are you sure you want to delete this scheme?')) return

        try {
            await axios.delete(`/api/scheme-management/schemes/${schemeId}`)
            setSnackbar({ open: true, message: 'Scheme deleted successfully!', severity: 'success' })
            fetchSchemes()
        } catch (err) {
            console.error('Error deleting scheme:', err)
            setSnackbar({ open: true, message: 'Failed to delete scheme', severity: 'error' })
        }
    }

    const handleViewScheme = (scheme) => {
        setSelectedScheme(scheme)
        setOpenViewDialog(true)
    }

    const resetForm = () => {
        setNewScheme({
            title: '',
            description: '',
            category: 'financial-assistance',
            eligibility: '',
            benefits: '',
            applicationProcess: '',
            documents: '',
            lastDateToApply: '',
            contactPhone: '',
            contactEmail: '',
            contactWebsite: '',
            status: 'active',
            relevance: 'medium',
            additionalInfo: '',
        })
        setFormErrors({})
        setEditMode(false)
        setSelectedScheme(null)
    }

    const filteredSchemes = schemes.filter((scheme) => {
        const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scheme.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory ? scheme.category === filterCategory : true
        const matchesStatus = filterStatus ? scheme.status === filterStatus : true
        return matchesSearch && matchesCategory && matchesStatus
    })

    const getCategoryColor = (category) => {
        const colors = {
            'insurance': 'primary',
            'financial-assistance': 'success',
            'credit': 'info',
            'technical-assistance': 'secondary',
            'infrastructure': 'warning',
            'sustainable-farming': 'success',
            'renewable-energy': 'info',
            'other': 'default',
        }
        return colors[category] || 'default'
    }

    const getStatusColor = (status) => {
        const colors = { active: 'success', inactive: 'default', upcoming: 'warning' }
        return colors[status] || 'default'
    }

    if (loading && schemes.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PolicyIcon color="primary" />
                Government Schemes Management
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <PolicyIcon color="primary" sx={{ fontSize: 40 }} />
                            <Typography variant="h4">{schemes.length}</Typography>
                            <Typography variant="body2" color="text.secondary">Total Schemes</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <MoneyIcon color="success" sx={{ fontSize: 40 }} />
                            <Typography variant="h4">{schemes.filter(s => s.status === 'active').length}</Typography>
                            <Typography variant="body2" color="text.secondary">Active Schemes</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent sx={{ textAlign: 'center' }}>
                            <EventIcon color="warning" sx={{ fontSize: 40 }} />
                            <Typography variant="h4">
                                {schemes.filter(s => s.lastDateToApply && new Date(s.lastDateToApply) > new Date()).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">Open for Application</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Filter */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search schemes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} label="Category">
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Status</InputLabel>
                            <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} label="Status">
                                <MenuItem value="">All Status</MenuItem>
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="inactive">Inactive</MenuItem>
                                <MenuItem value="upcoming">Upcoming</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => { resetForm(); setOpenAddDialog(true); }}
                        >
                            Add Scheme
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Schemes Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Scheme Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Relevance</TableCell>
                            <TableCell>Last Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSchemes.length > 0 ? (
                            filteredSchemes.map((scheme) => (
                                <TableRow key={scheme._id}>
                                    <TableCell>
                                        <Typography variant="subtitle2">{scheme.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {scheme.description.substring(0, 80)}...
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={categories.find(c => c.value === scheme.category)?.label || scheme.category}
                                            color={getCategoryColor(scheme.category)}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={scheme.status} color={getStatusColor(scheme.status)} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={scheme.relevance}
                                            color={scheme.relevance === 'high' ? 'error' : scheme.relevance === 'medium' ? 'warning' : 'default'}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {scheme.lastDateToApply
                                            ? new Date(scheme.lastDateToApply).toLocaleDateString()
                                            : 'Ongoing'}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="View">
                                            <IconButton color="primary" onClick={() => handleViewScheme(scheme)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton color="secondary" onClick={() => handleEditScheme(scheme)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton color="error" onClick={() => handleDeleteScheme(scheme._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No schemes found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add/Edit Scheme Dialog */}
            <Dialog open={openAddDialog} onClose={() => { setOpenAddDialog(false); resetForm(); }} maxWidth="md" fullWidth>
                <DialogTitle>{editMode ? 'Edit Scheme' : 'Add New Government Scheme'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Scheme Title *"
                                name="title"
                                value={newScheme.title}
                                onChange={handleInputChange}
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description *"
                                name="description"
                                value={newScheme.description}
                                onChange={handleInputChange}
                                error={!!formErrors.description}
                                helperText={formErrors.description}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select name="category" value={newScheme.category} onChange={handleInputChange} label="Category">
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Status</InputLabel>
                                <Select name="status" value={newScheme.status} onChange={handleInputChange} label="Status">
                                    <MenuItem value="active">Active</MenuItem>
                                    <MenuItem value="inactive">Inactive</MenuItem>
                                    <MenuItem value="upcoming">Upcoming</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel>Relevance</InputLabel>
                                <Select name="relevance" value={newScheme.relevance} onChange={handleInputChange} label="Relevance">
                                    <MenuItem value="high">High</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="low">Low</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Eligibility Criteria * (one per line)"
                                name="eligibility"
                                value={newScheme.eligibility}
                                onChange={handleInputChange}
                                error={!!formErrors.eligibility}
                                helperText={formErrors.eligibility}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Benefits * (one per line)"
                                name="benefits"
                                value={newScheme.benefits}
                                onChange={handleInputChange}
                                error={!!formErrors.benefits}
                                helperText={formErrors.benefits}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Application Process (one step per line)"
                                name="applicationProcess"
                                value={newScheme.applicationProcess}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Required Documents (one per line)"
                                name="documents"
                                value={newScheme.documents}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Last Date to Apply"
                                name="lastDateToApply"
                                value={newScheme.lastDateToApply}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                                helperText="Leave empty for ongoing schemes"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Phone"
                                name="contactPhone"
                                value={newScheme.contactPhone}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Email *"
                                name="contactEmail"
                                type="email"
                                value={newScheme.contactEmail}
                                onChange={handleInputChange}
                                error={!!formErrors.contactEmail}
                                helperText={formErrors.contactEmail}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Website URL"
                                name="contactWebsite"
                                value={newScheme.contactWebsite}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Additional Information"
                                name="additionalInfo"
                                value={newScheme.additionalInfo}
                                onChange={handleInputChange}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenAddDialog(false); resetForm(); }}>Cancel</Button>
                    <Button onClick={handleAddScheme} variant="contained" disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : editMode ? 'Update Scheme' : 'Add Scheme'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Scheme Dialog */}
            <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
                {selectedScheme && (
                    <>
                        <DialogTitle>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PolicyIcon color="primary" />
                                {selectedScheme.title}
                            </Box>
                        </DialogTitle>
                        <DialogContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" paragraph>
                                        {selectedScheme.description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle2" color="primary" gutterBottom>
                                                Eligibility Criteria
                                            </Typography>
                                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                {(selectedScheme.eligibility || []).map((item, i) => (
                                                    <li key={i}><Typography variant="body2">{item}</Typography></li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle2" color="success.main" gutterBottom>
                                                Benefits
                                            </Typography>
                                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                {(selectedScheme.benefits || []).map((item, i) => (
                                                    <li key={i}><Typography variant="body2">{item}</Typography></li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle2" color="info.main" gutterBottom>
                                                Application Process
                                            </Typography>
                                            <ol style={{ margin: 0, paddingLeft: 20 }}>
                                                {(selectedScheme.applicationProcess || []).map((item, i) => (
                                                    <li key={i}><Typography variant="body2">{item}</Typography></li>
                                                ))}
                                            </ol>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle2" color="warning.main" gutterBottom>
                                                Required Documents
                                            </Typography>
                                            <ul style={{ margin: 0, paddingLeft: 20 }}>
                                                {(selectedScheme.documents || []).map((item, i) => (
                                                    <li key={i}><Typography variant="body2">{item}</Typography></li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle2" gutterBottom>Contact Details</Typography>
                                            <Grid container spacing={1}>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography variant="caption" color="text.secondary">Phone</Typography>
                                                    <Typography variant="body2">{selectedScheme.contactDetails?.phone || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography variant="caption" color="text.secondary">Email</Typography>
                                                    <Typography variant="body2">{selectedScheme.contactDetails?.email || 'N/A'}</Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={4}>
                                                    <Typography variant="caption" color="text.secondary">Website</Typography>
                                                    <Typography variant="body2">
                                                        {selectedScheme.contactDetails?.website ? (
                                                            <a href={selectedScheme.contactDetails.website} target="_blank" rel="noopener noreferrer">
                                                                {selectedScheme.contactDetails.website}
                                                            </a>
                                                        ) : 'N/A'}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
                            <Button variant="outlined" onClick={() => { setOpenViewDialog(false); handleEditScheme(selectedScheme); }}>
                                Edit
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    )
}

export default SchemeManagement
