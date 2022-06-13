import { useState, useEffect } from 'react';
import _ from 'lodash';
import { Grid, Button } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import { getGroupsParsingStates, resetGroup } from '~/api';
import { LoadingOverlay } from '~/components';
import type { CommodityGroupParsingState } from '~/types';

interface CommodityClassWithItems {
    tov_class: string;
    items: CommodityGroupParsingState[];
}

export const GroupParsingComponent = (): JSX.Element => {
    const [classesWithItems, setClassesWithItems] = useState<CommodityClassWithItems[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const groupGroups = (groups: CommodityGroupParsingState[]): CommodityClassWithItems[] => {
        return _.map(_.groupBy(groups, 'tov_class'), (value, key) => ({ tov_class: key, items: value }));
    }

    const loadGroups = async (): Promise<void> => {
        setIsLoading(true);

        try {
            const groups: CommodityGroupParsingState[] = await getGroupsParsingStates();

            setClassesWithItems(groupGroups(groups));
        } catch(e) {} finally {
            setIsLoading(false);
        }
    };

    const handleGroupReset = async (id: number): Promise<void> => {
        try {
            await resetGroup(id);

            loadGroups();
        } catch(e) {}
    };

    useEffect(() => {
        loadGroups();
    }, []);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <table>
                    {classesWithItems.map(entry =>
                        <>
                            <tr>
                                <td colSpan={2} style={{ fontWeight: 'bold' }}>{entry.tov_class}</td>
                            </tr>
                            {entry.items.map(group =>
                                <tr>
                                    <td style={{ padding: '.5rem' }}>
                                        {group.button === 'green'
                                            ? <Button
                                                variant="contained"
                                                color="success"
                                                startIcon={<PlayArrow />}
                                                onClick={() => handleGroupReset(group.id)}
                                              >
                                                  Запустить
                                              </Button>
                                            : <Button variant="contained" color="error">Недоступно</Button>
                                        }
                                    </td>
                                    <td style={{ padding: '.5rem' }}>{group.tov_group} ({group.button})</td>
                                </tr>
                            )}
                            <tr style={{ height: '40px' }}></tr>
                        </>
                    )}
                </table>
                {isLoading && <LoadingOverlay />}
            </Grid>
        </Grid>
    );
};
