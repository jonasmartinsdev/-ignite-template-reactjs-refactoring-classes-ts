import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { IFood,  } from '../../@types/Food';

function Dashboard() {
  const [foods, setFoods] = useState<IFood[]>([])
  const [editingFood, setEditingFood] = useState({} as IFood)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  
  async function handleAddFood(food: IFood)  {
    try {
      const response = await api.post<IFood>('/foods', {
        ...food,
        available: true,
      });
      setFoods([...foods, response.data])
    } catch (error) {
      console.log(error);

    }
  }
 
  async function handleUpdateFood(food: IFood) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food })
     
        const foodsUpdated = foods.map(f =>
          f.id !== foodUpdated.data.id ? f : foodUpdated.data,
        );

        setFoods(foodsUpdated)
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);
    
    setFoods(foodsFiltered)
  }

  function handleEditFood(food: IFood) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  function toggleModal() {
    setModalOpen(prev => !prev)
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  useEffect(() => {
   async function fetchFood() {
    const response = await api.get('/foods');
    setFoods(response.data)
   }

   fetchFood()
    
  }, [])

    return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
    );
};

export default Dashboard;
