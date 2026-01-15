const GovernmentScheme = require('../models/GovernmentScheme');

/**
 * @desc    Handle Vapi tool calls
 * @route   POST /api/vapi/tool-call
 * @access  Public (should be protected by webhook secret in production)
 */
const handleToolCall = async (req, res) => {
    try {
        const { toolCall } = req.body;

        if (!toolCall) {
            return res.status(400).json({
                results: [
                    {
                        toolCallId: 'unknown',
                        result: 'No tool call provided'
                    }
                ]
            });
        }

        const { id, function: { name, arguments: args } } = toolCall;

        // Parse arguments if string
        let parsedArgs = args;
        if (typeof args === 'string') {
            try {
                parsedArgs = JSON.parse(args);
            } catch (e) {
                console.error('Error parsing tool arguments:', e);
            }
        }

        let result;

        switch (name) {
            case 'get_schemes':
                result = await getSchemes(parsedArgs);
                break;
            default:
                result = `Tool ${name} not found`;
        }

        res.status(200).json({
            results: [
                {
                    toolCallId: id,
                    result: typeof result === 'string' ? result : JSON.stringify(result)
                }
            ]
        });

    } catch (error) {
        console.error('Vapi tool call error:', error);
        res.status(500).json({
            results: [
                {
                    toolCallId: req.body.toolCall?.id || 'unknown',
                    error: error.message
                }
            ]
        });
    }
};

/**
 * Helper: Fetch schemes based on query
 */
const getSchemes = async (args) => {
    try {
        const query = args?.query || '';

        let dbQuery = { status: 'active' };

        // Simple text search if query provided
        if (query) {
            dbQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ];
        }

        // Check for ongoing or future deadlines
        dbQuery.$or = [
            ...(dbQuery.$or || []),
            { lastDateToApply: null },
            { lastDateToApply: { $gt: new Date() } }
        ];

        const schemes = await GovernmentScheme.find(dbQuery)
            .select('title description lastDateToApply benefits eligibility')
            .limit(5); // Limit slightly to avoid huge context

        if (schemes.length === 0) {
            return "No active government schemes found matching your request.";
        }

        // Format for the AI to read easily
        return schemes.map(s => ({
            name: s.title,
            description: s.description,
            deadline: s.lastDateToApply ? new Date(s.lastDateToApply).toLocaleDateString('hi-IN') : 'Ongoing (Koi antim tithi nahi)',
            benefits: s.benefits.join(', ')
        }));

    } catch (error) {
        console.error('Error fetching schemes:', error);
        return "Failed to fetch schemes info. Please try again later.";
    }
};

module.exports = {
    handleToolCall
};
