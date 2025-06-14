import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Input,
  Select,
  Upload,
  Space,
  Typography,
  Switch,
} from 'antd'
import { Form } from 'antd'
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  DownOutlined,
} from '@ant-design/icons'

import { GoDownload } from 'react-icons/go'
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetAllProductsQuery,
  useUpdateCSVProductMutation,
  useUpdateProductMutation,
} from '../../Redux/productApis'
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
} from '../../Redux/categoryApis'
import toast from 'react-hot-toast'
import { DownloadIcon } from 'lucide-react'

const { Title } = Typography
const { Option } = Select

const InventoryManagement = () => {
  const [products, setProducts] = useState([])
  const [isAddModalVisible, setIsAddModalVisible] = useState(false)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [downloadProducts, setDownloadProducts] = useState([])

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [createCategory, { isLoading: isCreateCategoryLoading }] =
    useCreateCategoryMutation()
  const {
    data: getAllCategories,
    isLoading: isGetAllCategoriesLoading,
    refetch,
  } = useGetAllCategoriesQuery()

  const [createProduct, { isLoading: isCreateProductLoading }] =
    useCreateProductMutation()
  const [createCSVProduct, { isLoading: isCreateProductCSVLoading }] =
    useUpdateCSVProductMutation()
  const { data: getAllProducts, isLoading: isGetAllProductsLoading } =
    useGetAllProductsQuery({
      page,
      limit: 10,
    })

  const {
    data: getAllProductsForDownload,
    isLoading: isGetAllProductsLoadingForDownload,
  } = useGetAllProductsQuery({
    limit: 999999999999,
  })
  const [updateProduct, { isLoading: isUpdateProductLoading }] =
    useUpdateProductMutation()
  const [deleteProduct, { isLoading: isDeleteProductLoading }] =
    useDeleteProductMutation()

  useEffect(() => {
    if (getAllProducts) {
      setProducts(getAllProducts?.data?.result)
      setDownloadProducts(getAllProductsForDownload?.data?.result)
    }
    if (getAllCategories) {
      setCategories(getAllCategories?.data)
    }
  }, [getAllProducts, getAllCategories])

  const [newCategoryName, setNewCategoryName] = useState('')
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false)
  const [isEditFeatureEnabled, setIsEditFeatureEnabled] = useState(false)

  const handleTableChange = (pagination) => {
    setPage(pagination.current)
    setPageSize(pagination.pageSize)
  }

  const handleFileUpload = async (file) => {
    console.log(file)
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await createCSVProduct(formData).unwrap()

        if (res.success) {
          toast.success(`File uploaded successfully`)
        } else {
          toast.error(res.message || 'Failed to upload file')
        }
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(error?.data?.message)
      }
    }
    return false
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id, _, index) => (id ? <a>{id}</a> : <a>{index + 1}</a>),
    },
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },

    // {
    //   title: 'Quantity',
    //   dataIndex: 'quantity',
    //   key: 'quantity',
    // },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    // {
    //   title: 'Price',
    //   dataIndex: 'price',
    //   key: 'price',
    // },
    {
      title: 'Flavor',
      dataIndex: 'flavour',
      key: 'flavour',
    },
    {
      title: 'Feature',
      dataIndex: 'isFeatured',
      key: 'isFeatured',
      render: (isFeatured) => {
        return isFeatured === true ||
          isFeatured === 'Yes' ||
          isFeatured === 'true'
          ? 'Yes'
          : 'No'
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
            className="bg-blue-500"
          >
            Edit
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteModal(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  const showAddModal = () => {
    form.resetFields()
    setIsAddModalVisible(true)
  }

  const showEditModal = (product) => {
    console.log('Current product data:', product)
    console.log('Product ID:', product._id || product.id)

    setCurrentProduct(product)
    const featureValue =
      product.isFeatured === true ||
      product.isFeatured === 'Yes' ||
      product.isFeatured === 'true' ||
      product.feature === true ||
      product.feature === 'Yes' ||
      product.feature === 'true'

    setIsEditFeatureEnabled(featureValue)
    editForm.setFieldsValue({
      name: product.name,
      category: product.category,
      // price: product.price,
      // quantity: product.quantity,
      flavour: product.flavour,
    })
    setIsEditModalVisible(true)
  }

  const showDeleteModal = (product) => {
    setCurrentProduct(product)
    setIsDeleteModalVisible(true)
  }

  const handleAddCancel = () => {
    setIsAddModalVisible(false)
  }

  const handleEditCancel = () => {
    setIsEditModalVisible(false)
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false)
  }

  const handleAddSubmit = async () => {
    try {
      const values = await form.validateFields()

      const formData = new FormData()

      formData.append(
        'data',
        JSON.stringify({
          name: values.name,
          category: values.category,
          flavour: values.flavour,
          // price: values.price,
          // quantity: values.quantity,
          isFeatured: isFeatureEnabled,
        })
      )

      const file = values.product_image?.[0]?.originFileObj
      if (file) {
        formData.append('product_image', file)
      }

      const res = await createProduct(formData).unwrap()

      if (res.success) {
        toast.success(res?.message)
        setIsAddModalVisible(false)
        form.resetFields()
        setIsFeatureEnabled(false)
      } else {
        toast.error(res.message || 'Something went wrong')
      }
    } catch (error) {
      toast.error(error?.data?.message)
      console.error(error)
    }
  }

  const handleEditSubmit = async () => {
    try {
      const values = await editForm.validateFields()

      const formData = new FormData()

      formData.append(
        'data',
        JSON.stringify({
          name: values.name,
          category: values.category,
          flavour: values.flavour,

          // price: values.price,
          // quantity: values.quantity,
          isFeatured: isEditFeatureEnabled,
        })
      )

      const file = values.product_image?.[0]?.originFileObj
      if (file) {
        formData.append('product_image', file)
      }

      const res = await updateProduct({
        id: currentProduct?._id,
        data: formData,
      }).unwrap()

      if (res.success) {
        toast.success(res?.message)
        setIsEditModalVisible(false)
        editForm.resetFields()
        setIsEditFeatureEnabled(false)
      } else {
        toast.error(res.message || 'Something went wrong')
      }
    } catch (error) {
      console.error(error)
      toast.error(error?.data?.message)
    }
  }
  const handleDelete = async () => {
    if (!currentProduct?._id) {
      toast.error('Product ID not found')
      return
    }

    try {
      await deleteProduct(currentProduct._id).unwrap()
      toast.success('Product deleted successfully')
      setIsDeleteModalVisible(false)
      refetch()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleAddCategory = async () => {
    try {
      const response = await createCategory({ newCategory: newCategoryName })
      refetch()
      setNewCategoryName('')
      toast.success(response?.message || 'Category added successfully')
    } catch (error) {
      toast.error(error?.message)
      console.error('Error adding category:', error)
    }
  }

  const handleDownloadFullCSV = () => {
    if (!downloadProducts || downloadProducts.length === 0) {
      toast.error('No products available to download')
      return
    }

    try {
      // Define CSV headers with all fields
      const headers = ['name', 'category', 'flavour', 'featured']

      // Convert products data to CSV format
      const csvData = downloadProducts.map((product, index) => {
        return [
          product.name || '',
          product.category || '',
          product.flavour || '',
          product.isFeatured === true ||
          product.isFeatured === 'Yes' ||
          product.isFeatured === 'true'
            ? 'Yes'
            : 'No',
        ]
      })

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map((row) =>
          row
            .map((field) => {
              // Handle fields that might contain commas or quotes
              const stringField = String(field)
              if (
                stringField.includes(',') ||
                stringField.includes('"') ||
                stringField.includes('\n')
              ) {
                return `"${stringField.replace(/"/g, '""')}"`
              }
              return `"${stringField}"`
            })
            .join(',')
        )
        .join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute(
          'download',
          `inventory_products_${new Date().toISOString().split('T')[0]}.csv`
        )
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url) // Clean up
      }
    } catch (error) {
      console.error('Error downloading CSV:', error)
      toast.error('Failed to download CSV file')
    }
  }

  return (
    <div className="p-4  bg-gray-200 h-screen !font-poppins">
      <div className="bg-white p-6 !rounded-xl ">
        <div className="mb-6 flex justify-between items-center max-xl:flex-col">
          <Title level={2} className="!font-bold">
            Inventory Management
          </Title>
          <div className="flex space-x-4">
            <Upload
              beforeUpload={handleFileUpload}
              showUploadList={false}
              accept=".csv"
            >
              <Button icon={<UploadOutlined />} className="mr-4 !font-poppins">
                Upload CSV
              </Button>
            </Upload>

            <div>
              <Button
                icon={<GoDownload className="!text-xm" />}
                className="mr-4 !font-poppins"
                onClick={handleDownloadFullCSV}
                loading={isGetAllProductsLoading}
              >
                {isGetAllProductsLoadingForDownload
                  ? 'Downloading...'
                  : 'Download CSV'}
              </Button>
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showAddModal}
              className="bg-green-500 !font-poppins"
            >
              Add Product
            </Button>
          </div>
        </div>

        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          pagination={{
            current: page,
            pageSize: pageSize,
            total: getAllProducts?.data?.meta?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
            pageSizeOptions: ['10', '20', '50', '100'],
            position: ['bottomCenter'],
          }}
          className="mb-6"
        />
      </div>

      {/* Add Product Modal */}
      <Modal
        title="Add New Product"
        open={isAddModalVisible}
        onCancel={handleAddCancel}
        footer={[
          <Button key="back" onClick={handleAddCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleAddSubmit}
            className="bg-green-500 !font-poppins"
          >
            Add Product
          </Button>,
        ]}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          name="add_product_form"
          requiredMark={false}
          className="!font-poppins"
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              placeholder="Select a category"
              allowClear
              showSearch
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <div className="p-2 border-t">
                    <div className="flex justify-between">
                      <Input
                        style={{ width: 'calc(100% - 80px)' }}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="New category"
                        id="new-category-input"
                      />
                      <Button
                        type="primary"
                        className="bg-blue-500"
                        onClick={() => {
                          handleAddCategory()
                        }}
                      >
                        {isCreateProductLoading ? 'Adding...' : ' Add'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            >
              {categories?.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter price' },
              {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: 'Please enter a valid price',
              },
            ]}
          >
            <Input
              prefix="$"
              type="number"
              step="0.01"
              min="0"
              placeholder="Enter price"
            />
          </Form.Item> */}

          {/* <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <Input type="number" min="0" placeholder="Enter quantity" />
          </Form.Item> */}
          <Form.Item
            name="flavour"
            label="flavour"
            rules={[{ required: true, message: 'Please enter flavour' }]}
          >
            <Input placeholder="Enter flavour" />
          </Form.Item>

          <Form.Item label="Feature">
            <div>
              <Switch
                checked={isFeatureEnabled}
                onChange={(checked) => setIsFeatureEnabled(checked)}
              />
              <span className="ml-2">
                Add this product as a feature{' '}
                {isFeatureEnabled ? '(Enabled)' : '(Disabled)'}
              </span>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal
        title="Edit Product"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        footer={[
          <Button key="back" onClick={handleEditCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleEditSubmit}
            className="bg-blue-500"
          >
            Update Product
          </Button>,
        ]}
        centered
      >
        <Form
          form={editForm}
          layout="vertical"
          name="edit_product_form"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
          >
            <Select
              placeholder="Select a category"
              allowClear
              showSearch
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <div className="p-2 border-t">
                    <div className="flex">
                      <Input
                        style={{ width: 'calc(100% - 80px)' }}
                        placeholder="New category"
                        id="edit-new-category-input"
                      />
                      <Button
                        type="primary"
                        className="bg-blue-500"
                        onClick={() => {
                          const input = document.getElementById(
                            'edit-new-category-input'
                          )
                          const value = input?.value
                          if (value && !categories.includes(value)) {
                            setCategories([...categories, value])
                            editForm.setFieldsValue({ category: value })
                            input.value = ''
                          }
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            >
              {categories.map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter price' },
              {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: 'Please enter a valid price',
              },
            ]}
          >
            <Input prefix="$" type="number" step="0.01" min="0" />
          </Form.Item> */}
          {/* 
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: 'Please enter quantity' }]}
          >
            <Input type="number" min="0" placeholder="Enter quantity" />
          </Form.Item> */}
          <Form.Item
            name="flavour"
            label="Flavour"
            rules={[{ required: true, message: 'Please enter flavour' }]}
          >
            <Input placeholder="Enter flavour" />
          </Form.Item>

          <Form.Item label="Feature">
            <div>
              <Switch
                checked={isEditFeatureEnabled}
                onChange={(checked) => setIsEditFeatureEnabled(checked)}
              />
              <span className="ml-2">
                Add this product as a feature{' '}
                {isEditFeatureEnabled ? '(Enabled)' : '(Disabled)'}
              </span>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Product"
        open={isDeleteModalVisible}
        onCancel={handleDeleteCancel}
        footer={[
          <Button key="back" onClick={handleDeleteCancel}>
            Cancel
          </Button>,
          <Button key="submit" danger type="primary" onClick={handleDelete}>
            Delete
          </Button>,
        ]}
        centered
      >
        <p>Are you sure you want to delete this product?</p>
        {currentProduct && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            {/* <p>
              <strong>ID:</strong> {currentProduct._id}
            </p> */}
            <p>
              <strong>Product:</strong> {currentProduct.name}
            </p>
            <p>
              <strong>Category:</strong> {currentProduct.category}
            </p>
            <p>
              <strong>Price:</strong> $
              {parseFloat(currentProduct.price).toFixed(2)}
            </p>
            <p>
              <strong>Quantity:</strong> {currentProduct.quantity}
            </p>
            <p>
              <strong>Feature:</strong> {currentProduct.feature ? 'Yes' : 'No'}
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default InventoryManagement
