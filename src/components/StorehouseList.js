
import React, { useContext, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { listStorehouses } from '../graphql/queries';
import { onCreateStorehouse } from '../graphql/subscriptions';
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
    // const [updateStoreDialog, setUpdateStoreDialog] = useState(false);
    const [deleteStoreDialog, setDeleteStoreDialog] = useState(false);
    // const [name, setName] = useState('');

    // const handleEditProduct = () => {
    //     setUpdateStoreDialog(true);
    //     setName(name);
    // }

    const user = useContext(UserContext);
    const onNewStorehouse = (prevQuery, newData) => {
        // shallow copy
        let updatedQuery = { ...prevQuery }
        const updatedStorehouseList = [
        newData.onCreateStorehouse,
        ...prevQuery.listStorehouses.items
        ];

        updatedQuery.listStorehouses.items = updatedStorehouseList;
        
        return updatedQuery;
    }

    // const handleUpdateStore = async storeId => {
    //     try {
    //     setUpdateStoreDialog(false);
    //     const input = {
    //         id: storeId,
    //         name
    //     }

    //     const result = await API.graphql(graphqlOperation(updateStorehouse, { input }));
    //     console.log('Update product', result)
        
    //     Notification({
    //         title: '成功',
    //         message: '製品の更新が完了しました！',
    //         type: 'success',
    //         duration: 2000
    //     });
    //     } catch(err) {
    //     console.error(`Failed to updated product with id: ${storeId}`, err);
    //     }
    // }

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

    return (
        <Connect
        query={graphqlOperation(listStorehouses)}
        subscription={graphqlOperation(onCreateStorehouse, { owner: user.username })}
        onSubscriptionMsg={onNewStorehouse}
        >
        {({ data, loading, errors }) => {
            if (errors.length > 0) return <Error errors={errors} />
            if (loading || !data.listStorehouses) return <Loading fullscreen={true} />

            return (
            <>
                <h2 className='header'>
                {/* <img src='https://icon.now.sh/store_mall_directory/527FFF' alt='Store Icon' className='large-icon' /> */}
                場所一覧
                </h2>
                {data.listStorehouses.items.map(storehouse => (
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
                    {/* <Button
                        type='warning'
                        icon='edit'
                        className='m-1'
                        onClick={() => handleEditProduct()}
                    /> */}
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
                    {/* <Dialog
                        title='カテゴリーの更新'
                        size='large'
                        customClass='dialog'
                        visible={updateStoreDialog}
                        onCancel={() => setUpdateStoreDialog(false)}>
                            {storehouse.name}
                        <Dialog.Body>
                        <Form labelPosition='top'>
                            <Form.Item label='カテゴリー'>
                            <Input
                                type='text'
                                icon='information'
                                trim={true}
                                value={name}
                                onChange={name => setName(name)}
                            />
                            </Form.Item>
                        </Form>
                        </Dialog.Body>
                        <Button onClick={() => handleUpdateStore(storehouse.id)}/>
                    </Dialog> */}
                    </Card>
                    
                </div>
                ))}
            </>
            )
        }}
        </Connect>
    )
};

export default StorehouseList;