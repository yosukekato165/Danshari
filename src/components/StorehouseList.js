
import React, { useContext, useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { listStorehouses } from '../graphql/queries';
import { onCreateStorehouse, onDeleteStorehouse } from '../graphql/subscriptions';
import { updateStorehouse, deleteStorehouse } from '../graphql/mutations';
import { Loading,
    Card,
    Notification,
    Popover,
    Button,
    Dialog,
    Form,
    Input} from "element-react";
import { Link } from 'react-router-dom';
import Error from './Error';
import { UserContext } from '../App';




const StorehouseList = () => {
    const [deleteStoreDialog, setDeleteStoreDialog] = useState(false);
    const [storehouse, setStorehouse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const user = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await API.graphql(graphqlOperation(listStorehouses));
                const listStorehouse = result.data.listStorehouses.items;
                setStorehouse(listStorehouse);
                setIsLoading(false);
            }catch(err) {
                console.error(err);
            }
        }
        fetchData();
    },[]);

    const handleDeleteProduct = async productId => {
        try {
        setDeleteStoreDialog(false);
        const input = { id: productId };
        await API.graphql(graphqlOperation(deleteStorehouse, { input }));

        Notification({
            title: '成功',
            message: '場所の削除が完了しました！',
            type: 'success',
            duration: 2000
        });
        } catch(err) {
        console.error(`Failed to deleted product with id: ${productId}`, err);
        }
    }

    useEffect(() => {

        const createStorehouseListener = API.graphql(graphqlOperation(onCreateStorehouse, { owner: user.name }))
                .subscribe({
                    next: storehouseData => {
                        const createStorehouse = storehouseData.value.data.onCreateStorehouse;
                        const prevStorehouse = storehouse.data.items
                        .filter(item => item.id !== createStorehouse.id);

                        const createStorehouseByCreateSubscription = 
                            [createStorehouse,
                            ...prevStorehouse];
                        
                        const newStorehouseByCreateSubscription = { ...StaticRange.storehouse};
                        newStorehouseByCreateSubscription.data.items
                        = createStorehouseByCreateSubscription;

                        setStorehouse(newStorehouseByCreateSubscription);
                    },
                    error: () =>{
                        console.log(Error);
                    }
                })


        const deletedStorehouseListener =  API.graphql(graphqlOperation(onDeleteStorehouse, { owner: user.name }))
                .subscribe({
                    next: storehouseData => {
                        const deletedStorehouse = storehouseData.value.data.onDeleteStorehouse;
                        const updatedStorehouseByDeleteSubscription = storehouse.data.items
                        .filter(item => item.id !== deletedStorehouse.id);

                        const newStorehouseByDeleteSubscription = { ...storehouse };
                        newStorehouseByDeleteSubscription.data.items 
                            = updatedStorehouseByDeleteSubscription;
                        setStorehouse(newStorehouseByDeleteSubscription);
                    },
                    error: () => {
                        console.log(Error);
                    }
                })


            return () => {
                createStorehouseListener.unsubscribe();
                deletedStorehouseListener.unsubscribe();
            }
    }, [storehouse, user.name, user.username]);

            return isLoading ? (
                <Loading fullscreen={true}/>
            ) : (
            <>
                <h2 className='header'>
                棚一覧
                </h2>
                {storehouse.map(storehouse => (
                <div key={storehouse.id} className='my-2'>
                    <Card
                    bodyStyle={{
                        padding: '0.7em',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                    >
                    
                    <div>
                        <Link className='link' to={`/storehouses/${storehouse.id}`}>
                            <span className='flex'>   
                                {storehouse.name}
                            <img src='https://icon.now.sh/store_mall_directory' alt='Shopping Cart' />
                            </span>
                            <div style={{ color: 'var(--lightSquidInk)' }}>
                            {storehouse.owner}
                            </div>
                        </Link>
                    </div>
                    <Popover
                        placement='top'
                        width='160'
                        trigger='click'
                        visible={deleteStoreDialog}
                        content={
                        <>
                            <p>Do you want to delete this?</p>
                            <div className='text-right'>
                            <Button
                                size='mini'
                                type='text'
                                className='m-1'
                                onClick={() => setDeleteStoreDialog(false)}
                            >
                                キャンセル
                            </Button>
                            <Button
                                type='primary'
                                size='mini'
                                className='m-1'
                                onClick={() => handleDeleteProduct(storehouse.id)}
                            >
                                削除
                            </Button>
                            </div>
                        </>
                        }
                    >
                        <Button
                        type='danger'
                        icon='delete'
                        onClick={() => setDeleteStoreDialog(true)}
                        />
                    </Popover>
                    </Card>
                    
                </div>
                ))}
            </>
            )
};

export default StorehouseList;