import React from 'react';
import { Card, CardContent, CardHeader, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import { planService } from '../../services/planService';

const PlanComparison = ({ plans = [], recommendations = [], onSubscribe }) => {
  const handleSubscribe = async (id) => {
    await planService.subscribe(id);
    onSubscribe?.();
  };

  return (
    <Card>
      <CardHeader title="Plan Comparison" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Plan</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Data</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((p) => (
              <TableRow key={p.id} hover>
                <TableCell>{p.name}</TableCell>
                <TableCell align="right">${p.price}/mo</TableCell>
                <TableCell align="right">{p.dataQuotaGB ? `${p.dataQuotaGB} GB` : 'Unlimited'}</TableCell>
                <TableCell align="right">
                  <Button size="small" variant="contained" onClick={() => handleSubscribe(p.id)}>Subscribe</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PlanComparison;
