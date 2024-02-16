import { Router } from 'express';
import axios from 'axios';

const router = Router();

// Route to grap the count of pokemon that are save on db
router.get('/count', async (req, res) => {
    // const idOrName = req.params.idOrName;
    // try {
    //     const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1');
    //     res.json(response.data);
    // } catch (error) {
    //     res.status(500).json({error: 'Internal Server Error'});
    // }
});

// Route to grab a list of pokemons started from and with limit
router.get('/:offset&:limit', async (req, res) => {
    const offset = req.params.offset;
    const limit = req.params.limit;
    // try{
        
    //     const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=60`;
    //     const response = await axios.get(url);
    //     res.json(response.data);
    // }
    // catch (error) {
    //     res.status(500).json({error: 'Internal Server Error'});
    // }
});

export default router;